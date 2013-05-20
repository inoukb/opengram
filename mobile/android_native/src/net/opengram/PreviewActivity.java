package net.opengram;

import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.net.Uri;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.Window;
import android.util.Log;
import android.provider.MediaStore;
import android.database.Cursor;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.EditText;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.location.Criteria;
import android.content.Context;
import android.os.AsyncTask;
import android.app.ProgressDialog;
import java.util.Calendar;
import org.apache.http.HttpResponse;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import java.io.File;

import android.provider.Settings.Secure;

public class PreviewActivity extends Activity implements OnClickListener, LocationListener
{

    private Button _save;
    private Button _abort;
    private LinearLayout _linear;
    private EditText _comment;
    private TextView _location;
    private LocationManager _lmgr;
    private Uri _uri;
    private Location _pos;

    private class DownloadTask extends AsyncTask<Void, Void, Void>
    {
        ProgressDialog _dialog;

        @Override
        protected void onPreExecute()
        {
            _dialog = new ProgressDialog(PreviewActivity.this);
            _dialog.setCanceledOnTouchOutside(false);
            _dialog.setMessage("Envoi en cours...");
            _dialog.show();
        }

        @Override
        protected Void doInBackground(Void ...v)
        {
            DefaultHttpClient client = new DefaultHttpClient();
            //HttpPost post = new HttpPost("http://opengram.appspot.com/receive");
            HttpPost post = new HttpPost("http://mystartupweekend.nsxdesign.fr/receive.php");
            MultipartEntity entity = new MultipartEntity();

            try
            {
                entity.addPart("location", new StringBody("" + _pos.getLatitude() + "," + _pos.getLongitude()));
                entity.addPart("datetime", new StringBody("" + Calendar.getInstance().getTimeInMillis()));
                entity.addPart("phone_id", new StringBody(Secure.getString(PreviewActivity.this.getContentResolver(), Secure.ANDROID_ID)));
                entity.addPart("comment", new StringBody(_comment.getText().toString()));
                entity.addPart("file", new FileBody(new File(getRealPathFromURI(_uri)), "image/jpeg"));
                post.setEntity(entity);
                HttpResponse response = client.execute(post);
            }
            catch (Exception e)
            {
            }
            return null;
        }

        @Override
        protected void onPostExecute(Void v)
        {
            _dialog.hide();
            PreviewActivity.this.finish();
        }
    }

    public String getRealPathFromURI(Uri contentUri)
    {
        try
        {
            String[] proj = { MediaStore.Images.Media.DATA };
            Cursor cursor = managedQuery(contentUri, proj, null, null, null);
            int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
            cursor.moveToFirst();
            return cursor.getString(column_index);
        }
        catch (Exception e)
        {
            return contentUri.getPath();
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.preview);

        _linear = (LinearLayout) findViewById(R.id.linear);
        _location = (TextView) findViewById(R.id.location);
        _comment = (EditText) findViewById(R.id.comment);
        _save = (Button) findViewById(R.id.save);
        _save.setOnClickListener(this);
        _abort = (Button) findViewById(R.id.abort);
        _abort.setOnClickListener(this);

        _lmgr = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        Criteria criteria = new Criteria();
        criteria.setAccuracy(Criteria.ACCURACY_COARSE);
        criteria.setAltitudeRequired(false);
        criteria.setBearingRequired(false);
        String provider = _lmgr.getBestProvider(criteria, false);
        _lmgr.requestLocationUpdates(provider, 200, 0, this);
        Location location = _lmgr.getLastKnownLocation(provider);
        Log.d("PreviewActivity", provider);
        if (_lmgr.isProviderEnabled(provider))
        {
            Log.d("PreviewActivity", "The provider is disabled");
        }
        if (location != null)
            Log.d("PreviewActivity", "" + location.getLatitude());

        _uri = getIntent().getParcelableExtra("uri");
        //Log.d("PreviewActivity", getRealPathFromURI(uri));
        //BitmapDrawable d = new BitmapDrawable(getRealPathFromURI(uri));
        //_linear.setBackgroundDrawable(d);
    }

    @Override
    public void onClick(View button)
    {
        if (button == _abort)
        {
            Log.d("PreviewActivity", "Ciao Preview !");
            finish();
        }
        else if (button == _save)
        {
            Log.d("PreviewActivity", "Let's gooo !");
            DownloadTask task = new DownloadTask();
            task.execute();
        }
    }

    @Override
    public void onLocationChanged(Location location)
    {
        Log.d("PreviewActivity", "Onlocationchanged");
        _location.setText("Lat:" + location.getLatitude() + " Lng:" + location.getLongitude());
        _pos = location;
        _save.setEnabled(true);
    }

    @Override
    public void onProviderEnabled(String provider)
    {
        Log.d("PreviewActivity", "onProviderEnabled");
    }

    @Override
    public void onProviderDisabled(String provider)
    {
        Log.d("PreviewActivity", "onProviderDisabled");
    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras)
    {
        Log.d("PreviewActivity", "onStatusChanged");
    }
}

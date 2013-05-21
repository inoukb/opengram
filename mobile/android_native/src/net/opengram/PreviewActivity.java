package net.opengram;

import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.view.View;
import android.view.View.OnClickListener;
import android.util.Log;
import android.widget.Button;
import android.widget.RelativeLayout;
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
import java.io.FileOutputStream;
import android.os.Environment;

import android.provider.Settings.Secure;

public class PreviewActivity extends Activity implements OnClickListener, LocationListener
{


    private Button		_save;
    private Button		_abort;
    private RelativeLayout	_relative;
    private EditText		_comment;
    private TextView		_location;
    private LocationManager	_lmgr;
    private Location		_pos;
    private File _file;

    private class DownloadTask extends AsyncTask<Void, Void, Void>
    {
        private ProgressDialog	_dialog;

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
            HttpPost post = new HttpPost("http://mystartupweekend.nsxdesign.fr/receive.php");
            MultipartEntity entity = new MultipartEntity();

            try
            {
                entity.addPart("location", new StringBody("" + _pos.getLatitude() + "," + _pos.getLongitude()));
                entity.addPart("datetime", new StringBody("" + Calendar.getInstance().getTimeInMillis()));
                entity.addPart("phone_id", new StringBody(Secure.getString(PreviewActivity.this.getContentResolver(), Secure.ANDROID_ID)));
                entity.addPart("comment", new StringBody(_comment.getText().toString()));
                entity.addPart("file", new FileBody(_file));
                post.setEntity(entity);
                HttpResponse response = client.execute(post);
            }
            catch (Exception e) {}
            return null;
        }

        @Override
        protected void onPostExecute(Void v)
        {
            _dialog.hide();
            PreviewActivity.this.finish();
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.preview);

        _relative = (RelativeLayout) findViewById(R.id.relative);
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
        byte[] b = getIntent().getExtras().getByteArray("picture");
        Bitmap bmp = BitmapFactory.decodeByteArray(b, 0, b.length);
        BitmapDrawable d = new BitmapDrawable(bmp);
        _relative.setBackgroundDrawable(d);
        _file = new File(
            Environment.getExternalStoragePublicDirectory(
                Environment.DIRECTORY_PICTURES
            ), "Opengram");
        try
        {
            FileOutputStream fos = new FileOutputStream(_file);
            fos.write(b);
        }
        catch (Exception e) {}
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

package net.opengram;

import android.app.Activity;
import android.os.Bundle;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.view.View;
import android.widget.TextView;
import android.view.View.OnClickListener;
import android.content.Intent;
import android.util.Log;
import android.net.Uri;

public class MainActivity extends Activity implements OnClickListener
{
    private static int TAKE_PICTURE = 0x10;
    private ImageButton	_takePicture;
    private ImageView	_logo;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
	_logo = (ImageView)findViewById(R.id.logo);
        _takePicture = (ImageButton)findViewById(R.id.take);
        _takePicture.setOnClickListener(this);
    }

    @Override
    public void onClick(View button)
    {	_logo.getDrawable().clearColorFilter();
	_takePicture.getDrawable().clearColorFilter();
        if (button == _takePicture)
        {
	    button.setBackgroundResource(R.drawable.take_press);
            Intent intent = new Intent("android.media.action.IMAGE_CAPTURE");
            startActivityForResult(intent, TAKE_PICTURE);
            Log.d("MainActivity", "Go on Camera !");
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data)
    {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == TAKE_PICTURE)
        {
            if (resultCode == RESULT_OK)
            {
                Log.d("MainActivity", "Tu as pris une photo et c'est sur !");
                Uri uri = data.getData();
                Intent intent = new Intent(MainActivity.this, PreviewActivity.class);
                intent.putExtra("uri", uri);
                startActivity(intent);
            }
            else
                Log.d("MainActivity", "Tu n'as pris une photo !");
        }
    }
}

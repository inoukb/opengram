package net.opengram;

import android.app.Activity;
import android.os.Bundle;
import android.widget.Button;
import android.view.View;
import android.view.View.OnClickListener;
import android.content.Intent;
import android.util.Log;
import android.graphics.Bitmap;
import java.io.ByteArrayOutputStream;

public class MainActivity extends Activity implements OnClickListener
{
    private static int TAKE_PICTURE = 0x10;

    private Button _takePicture;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        _takePicture = (Button)findViewById(R.id.take_picture);
        _takePicture.setOnClickListener(this);
    }

    @Override
    public void onClick(View button)
    {
        if (button == _takePicture)
        {
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
                Bitmap image = (Bitmap) data.getExtras().get("data");
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                image.compress(Bitmap.CompressFormat.JPEG, 100, baos); 
                byte[] b = baos.toByteArray();

                Intent intent = new Intent(MainActivity.this, PreviewActivity.class);
                intent.putExtra("picture", b);
                startActivity(intent);
            }
            else
                Log.d("MainActivity", "Tu n'as pris une photo !");
        }
    }
}


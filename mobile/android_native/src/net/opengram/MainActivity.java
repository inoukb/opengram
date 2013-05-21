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
import android.graphics.Bitmap;
import java.io.ByteArrayOutputStream;

public class MainActivity extends Activity implements OnClickListener
{
    private static int TAKE_PICTURE = 0x10;

    private ImageButton _takeButton;
    private ImageButton _infoButton;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        _takeButton = (ImageButton)findViewById(R.id.take);
        _takeButton.setOnClickListener(this);
        _infoButton = (ImageButton)findViewById(R.id.info);
        _infoButton.setOnClickListener(this);
    }

    @Override
    public void onClick(View button)
    {
        if (button == _takeButton)
        {
            Log.d("MainActivity", "Go on Camera !");
            Intent intent = new Intent("android.media.action.IMAGE_CAPTURE");
            startActivityForResult(intent, TAKE_PICTURE);
        }
        else if (button == _infoButton)
        {
            Log.d("MainActivity", "Go on InfoActivity !");
            Intent intent = new Intent(this, InfoActivity.class);
            startActivity(intent);
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
                Log.d("MainActivity", "U have take a picture !");
                Bitmap image = (Bitmap) data.getExtras().get("data");
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                image.compress(Bitmap.CompressFormat.JPEG, 100, baos);
                byte[] b = baos.toByteArray();

                Intent intent = new Intent(MainActivity.this, PreviewActivity.class);
                intent.putExtra("picture", b);
                startActivity(intent);
            }
            else
                Log.d("MainActivity", "U don't have a picture");
        }
    }
}

package net.opengram;

import android.app.Activity;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import android.view.View.OnClickListener;
import android.view.View;
import android.content.Intent;
import android.net.Uri;

public class SuccessActivity extends Activity implements OnClickListener
{
    private Button   _mapButton;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.success);

        _mapButton = (Button) findViewById(R.id.map);
        _mapButton.setOnClickListener(this);
    }

    @Override
    public void onClick(View button)
    {
        if (button == _mapButton)
        {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(getString(R.string.url)));
            startActivity(intent);
        }
    }
}

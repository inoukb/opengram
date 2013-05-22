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
    private TextView _url;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.success);

	_url = (TextView) findViewById(R.id.url);
	_url.setText(_url.getText().toString() + "http://inoukb.github.io/opengram/demo/");
        _mapButton = (Button) findViewById(R.id.map);
        _mapButton.setOnClickListener(this);
    }

    @Override
    public void onClick(View button)
    {
        if (button == _mapButton)
        {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("http://inoukb.github.io/opengram/demo/"));
            startActivity(intent);
        }
    }
}

package com.mediavault.app

import android.content.Context
import android.webkit.JavascriptInterface
import android.widget.Toast

class WebAppInterface(private val context: Context) {

    @JavascriptInterface
    fun showToast(message: String) {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
    }

    @JavascriptInterface
    fun startDownload(url: String, filename: String) {
        // Will be implemented with DownloadService on PC
        Toast.makeText(context, "Download: $filename", Toast.LENGTH_SHORT).show()
    }

    @JavascriptInterface
    fun getDeviceInfo(): String {
        return "Android ${android.os.Build.VERSION.RELEASE}"
    }
}

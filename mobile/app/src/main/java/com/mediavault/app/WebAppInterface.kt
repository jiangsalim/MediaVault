package com.mediavault.app

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Environment
import android.webkit.JavascriptInterface
import android.widget.Toast
import java.io.File

class WebAppInterface(private val context: Context) {

    @JavascriptInterface
    fun showToast(message: String) {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
    }

    @JavascriptInterface
    fun getDownloadPath(): String {
        val dir = File(Environment.getExternalStorageDirectory(), "MediaVault/downloads")
        if (!dir.exists()) dir.mkdirs()
        return dir.absolutePath
    }

    @JavascriptInterface
    fun getStoragePath(): String {
        return Environment.getExternalStorageDirectory().absolutePath
    }

    @JavascriptInterface
    fun shareFile(filePath: String) {
        val file = File(filePath)
        val uri = Uri.fromFile(file)
        val shareIntent = Intent(Intent.ACTION_SEND).apply {
            type = if (filePath.endsWith(".mp3") || filePath.endsWith(".m4a")) "audio/*" else "video/*"
            putExtra(Intent.EXTRA_STREAM, uri)
        }
        context.startActivity(Intent.createChooser(shareIntent, "Share via"))
    }

    @JavascriptInterface
    fun openApp(packageName: String) {
        try {
            val intent = context.packageManager.getLaunchIntentForPackage(packageName)
            if (intent != null) {
                context.startActivity(intent)
            }
        } catch (e: Exception) {
            Toast.makeText(context, "App not found", Toast.LENGTH_SHORT).show()
        }
    }

    @JavascriptInterface
    fun installApk(filePath: String) {
        val file = File(filePath)
        val uri = Uri.fromFile(file)
        val intent = Intent(Intent.ACTION_VIEW).apply {
            setDataAndType(uri, "application/vnd.android.package-archive")
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_GRANT_READ_URI_PERMISSION
        }
        context.startActivity(intent)
    }

    @JavascriptInterface
    fun getAppVersion(): String {
        return try {
            context.packageManager.getPackageInfo(context.packageName, 0).versionName ?: "1.0.0"
        } catch (e: Exception) {
            "1.0.0"
        }
    }
}

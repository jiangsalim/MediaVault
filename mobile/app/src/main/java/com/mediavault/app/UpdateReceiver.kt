package com.mediavault.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.widget.Toast

class UpdateReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_PACKAGE_REPLACED) {
            val packageName = intent.data?.schemeSpecificPart
            if (packageName == context.packageName) {
                Toast.makeText(context, "MediaVault updated successfully!", Toast.LENGTH_LONG).show()
            }
        }
    }
}

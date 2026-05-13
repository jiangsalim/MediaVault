# MediaVault APK

## Build Instructions

1. Open this folder in Android Studio
2. Wait for Gradle sync to complete
3. Build > Build APK
4. Find APK in app/build/outputs/apk/debug/

## Deploy to APKPure

1. Go to APKPure Developer Console
2. Add new application
3. Upload signed APK
4. Fill in app details and screenshots
5. Submit for review

## Update Website

After APK is live on APKPure:
1. Update public/api/latest-version.json with new APK URL
2. Deploy website to Vercel

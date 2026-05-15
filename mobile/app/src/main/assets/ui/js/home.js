var Home = {
  load: function() {
    document.getElementById('page-home').innerHTML = '<div style="padding:20px;text-align:center;margin-top:60px;"><h1 style="font-size:24px;font-weight:700;">What do you want to download?</h1><div style="max-width:500px;margin:20px auto;"><div style="display:flex;align-items:center;background:var(--surface);border:1px solid var(--border);border-radius:99px;padding:4px 4px 4px 20px;"><span style="margin-right:12px;">🔍</span><input type="text" placeholder="Search or paste URL..." style="flex:1;border:none;outline:none;background:transparent;font-size:15px;color:var(--text);padding:10px 0;"></div></div></div>';
    console.log('Home page rendered');
  },
};

/* Where the Android APK lives.
   On GitHub Pages this is worked out automatically.
   On any other host (Netlify, etc.) set HG_REPO to "YOUR-GITHUB-USER/YOUR-REPO", e.g. "paul/herdguard". */
window.HG_REPO = 'calcke/herdguard';

window.hgApkUrl = function () {
  var repo = window.HG_REPO;
  if (!repo) {
    var m = location.hostname.match(/^([^.]+)\.github\.io$/);
    if (m) {
      var parts = location.pathname.split('/').filter(Boolean);
      repo = m[1] + '/' + (parts.length ? parts[0] : m[1] + '.github.io');
    }
  }
  return repo ? 'https://github.com/' + repo + '/releases/download/app-latest/herdguard.apk' : '';
};
// the installed Android app itself runs on localhost: no need to offer the download there
window.hgShowApk = function () { return !/^(localhost|127\.0\.0\.1)$/.test(location.hostname); };

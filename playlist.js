// Spotify OAuth bejelentkezés URL
const clientId = '19c9091ee5eb4b2ca39515977eded61d';
const redirectUri = 'http://127.0.0.1:5500/edzesterv/index.html';
const scopes = 'playlist-read-private';

const authEndpoint = 'https://accounts.spotify.com/authorize';

loginBtn.addEventListener('click', () => {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
  window.location = authUrl;
});

// Token kinyerése URL-ből
function getAccessToken() {
  const hash = window.location.hash;
  if (!hash) return null;
  const params = new URLSearchParams(hash.substring(1));
  return params.get('access_token');
}

const token = getAccessToken();
if (token) {
  loginBtn.style.display = 'none';
  fetchPlaylists(token);
}

function fetchPlaylists(token) {
  fetch('https://api.spotify.com/v1/me/playlists', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('playlistContainer');
    data.items.forEach(pl => {
      const div = document.createElement('div');
      div.className = 'playlist-card';
      div.innerHTML = `<img src="${pl.images[0]?.url || ''}" alt="${pl.name}"><h5>${pl.name}</h5><p>${pl.tracks.total} track</p>`;
      div.addEventListener('click', () => showTracks(pl, token));
      container.appendChild(div);
    });
  });
}

function showTracks(playlist, token) {
  fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => {
    const modalIframe = document.getElementById('trackPreview');
    // az első track preview lejátszása
    const preview = data.items[0]?.track?.preview_url;
    if (preview) modalIframe.src = preview;
    new bootstrap.Modal(document.getElementById('trackModal')).show();
  });
}

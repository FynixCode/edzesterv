// Spotify OAuth bejelentkezés URL
const clientId = '0fb635d418324a0989be053002dbca55'; // A te Client ID-d
const redirectUri = 'https://fynixcode.github.io/edzesterv/playlist.html';
const scopes = 'playlist-read-private';

const loginBtn = document.getElementById('loginBtn');

const authEndpoint = 'https://accounts.spotify.com/authorize';

loginBtn.addEventListener('click', () => {
  const authUrl = `${authEndpoint}?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
  window.location = authUrl;
});

// Token kinyerése URL-ből
function getAccessToken() {
  const hash = window.location.hash;
  console.log("URL hash:", hash);
  if (!hash) return null;
  const params = new URLSearchParams(hash.substring(1));
  return params.get('access_token');
}

const token = getAccessToken();
console.log("Access token:", token);

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
    container.innerHTML = ''; // törlés
    data.items.forEach(pl => {
      const div = document.createElement('div');
      div.className = 'playlist-card col-12 col-sm-6 col-md-4 col-lg-3';
      div.innerHTML = `
        <img src="${pl.images[0]?.url || ''}" alt="${pl.name}">
        <h5>${pl.name}</h5>
        <p>${pl.tracks.total} track</p>
      `;
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
    const preview = data.items[0]?.track?.preview_url;
    if (preview) {
      const audio = document.getElementById('trackPreviewAudio');
      audio.src = preview;
      audio.play();
      new bootstrap.Modal(document.getElementById('trackModal')).show();
    } else {
      alert("Ehhez a számhoz nincs preview!");
    }
  });
}





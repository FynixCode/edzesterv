const urlParams = new URLSearchParams(window.location.search);
const month = urlParams.get('month') || 'december';
const week = urlParams.get('week') || 'week1'; // a data.json-ban a hetek key-je week1, week2...

const daysOfWeek = ['Hétfő','Kedd','Szerda','Csütörtök','Péntek','Szombat','Vasárnap'];
const weekContainer = document.getElementById('week');

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    const monthData = data.month[week] || {}; // kikeressük a hónap adott hetét
    let dayIndex = 1;

    daysOfWeek.forEach(dayName => {
      const dayData = monthData[dayIndex] || {exercises: [], progress: 0};

      // nap kártya létrehozása
      const dayCard = document.createElement('div');
      dayCard.className = 'day-card';
      
      // exercise lista HTML generálása
      const exercisesHTML = dayData.exercises.map(ex => `<li>${ex}</li>`).join('');

      // innerHTML beállítása
      dayCard.innerHTML = `
        <h2 class="day-header">${dayName}</h2>
        <ul class="exercises">
          ${exercisesHTML}
        </ul>
        <div class="progress">
          <div class="progress-bar" role="progressbar" style="width:0%" aria-valuenow="${dayData.progress}" aria-valuemin="0" aria-valuemax="100">${dayData.progress}%</div>
        </div>
      `;

      weekContainer.appendChild(dayCard);
      dayIndex++;
    });

    // progress bar animáció
    document.querySelectorAll('.progress-bar').forEach(bar => {
      const val = bar.getAttribute('aria-valuenow');
      setTimeout(()=>{ bar.style.width = val + '%'; }, 300);
    });
  });


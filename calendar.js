const weekContainer = document.getElementById('week-calendar');
const daysOfWeek = ['Hétfő','Kedd','Szerda','Csütörtök','Péntek','Szombat','Vasárnap'];

fetch('data.json')
  .then(res=>res.json())
  .then(data=>{
    const monthData = data.month['december']['week1'];

    daysOfWeek.forEach((dayName,i)=>{
      const dayIndex = (i+1).toString();
      const dayData = monthData[dayIndex];

      const dayCard = document.createElement('div');
      dayCard.className='day-card';

      let exercisesHTML='';
      ['warmup','strength','assistance','plyo','drills','core','cooldown'].forEach(cat=>{
        if(dayData[cat]){
          dayData[cat].forEach(ex=>{
            exercisesHTML+=`<div class="exercise-item" data-video="${ex.video}">${ex.name}</div>`;
          });
        }
      });

      dayCard.innerHTML=`<div class="day-header">${dayData.title}</div>${exercisesHTML}<div class="progress"><div class="progress-bar" role="progressbar" style="width:0%" aria-valuenow="${dayData.progress||0}" aria-valuemin="0" aria-valuemax="100">${dayData.progress||0}%</div></div>`;
      weekContainer.appendChild(dayCard);
    });

    // progress bar animáció
    document.querySelectorAll('.progress-bar').forEach(bar=>{
      const val=bar.getAttribute('aria-valuenow');
      setTimeout(()=>{ bar.style.width=val+'%'; },300);
    });

    // videó modal
    document.querySelectorAll('.exercise-item').forEach(item=>{
      item.addEventListener('click',()=>{
        const iframe=document.getElementById('exerciseVideo');
        iframe.src=item.getAttribute('data-video')+"?autoplay=1&rel=0";
        const modal=new bootstrap.Modal(document.getElementById('videoModal'));
        modal.show();
        document.getElementById('videoModal').addEventListener('hidden.bs.modal',()=>{ iframe.src=""; });
      });
    });
  });

document.addEventListener('DOMContentLoaded', () => {
  const scheduleElement = document.getElementById('schedule');
  const searchInput = document.getElementById('searchInput');
  let talks = [];

  fetch('/talks.json')
    .then(response => response.json())
    .then(data => {
      talks = data;
      renderSchedule(talks);
    });

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTalks = talks.filter(talk => 
      talk.category.some(cat => cat.toLowerCase().includes(searchTerm))
    );
    renderSchedule(filteredTalks);
  });

  function renderSchedule(talksToRender) {
    scheduleElement.innerHTML = '';
    let currentTime = new Date();
    currentTime.setHours(10, 0, 0, 0);

    talksToRender.forEach((talk, index) => {
      if (index === 3) {
        const lunchBreak = document.createElement('div');
        lunchBreak.className = 'break';
        lunchBreak.innerHTML = `<h3>Lunch Break</h3><p>${formatTime(currentTime)} - ${formatTime(new Date(currentTime.getTime() + 60 * 60 * 1000))}</p>`;
        scheduleElement.appendChild(lunchBreak);
        currentTime.setMinutes(currentTime.getMinutes() + 60);
      }

      const talkElement = document.createElement('div');
      talkElement.className = 'talk';

      const talkTime = formatTime(currentTime);
      const endTime = new Date(currentTime.getTime() + talk.duration * 60 * 1000);
      const talkEndTime = formatTime(endTime);

      talkElement.innerHTML = `
        <div class="talk-time">${talkTime} - ${talkEndTime}</div>
        <h2 class="talk-title">${talk.title}</h2>
        <div class="talk-speakers">${talk.speakers.join(', ')}</div>
        <div class="talk-category">
          ${talk.category.map(cat => `<span>${cat}</span>`).join('')}
        </div>
        <p class="talk-description">${talk.description}</p>
      `;
      scheduleElement.appendChild(talkElement);

      currentTime = new Date(endTime.getTime() + 10 * 60 * 1000); // 10 minute break
    });
  }

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
});

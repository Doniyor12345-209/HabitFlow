let colors = ['var(--a1)', 'var(--a2)', 'var(--a3)', 'var(--a4)', 'var(--a5)'];

function update() {
    let cards = document.querySelectorAll('#habitsList .hcard');

    let arr = [];
    cards.forEach(function (card) {
        let checkbox = card.querySelector('input[type="checkbox"]');
        let nameEl = card.querySelector('.hname');

        arr.push({
            name: nameEl.textContent,
            checked: checkbox.checked
        });
    });

    let done = 0;
    arr.forEach(function (x) {
        if (x.checked) done++;
    });

    let percent = arr.length ? Math.round((done / arr.length) * 100) : 0;

    let current = 0;
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i].checked) current++;
        else break;
    }

    let best = 0;
    let temp = 0;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i].checked) {
            temp++;
            if (temp > best) best = temp;
        } else {
            temp = 0;
        }
    }

    document.getElementById('listMeta').textContent = arr.length + ' привычек на сегодня';

    updateStats(arr, { done, percent, best });
    updateRing(percent, done, arr.length - done, arr.length);

    updateBars(arr);
    updateMiniList(arr);
    updateStreakList(arr);
}

function updateStats(arr, data) {
    if (!arr.length) {
        document.getElementById('statTotal').textContent = '0';
        document.getElementById('statPercent').textContent = '0%';
        document.getElementById('statBest').textContent = '0';
        return;
    }

    document.getElementById('statTotal').textContent = arr.length;
    document.getElementById('statPercent').textContent = data.percent + '%';
    document.getElementById('statBest').textContent = data.best;
}

function updateRing(percent, done, left, total) {
    let circumference = 408;
    let offset = circumference - (circumference * percent / 100);

    document.getElementById('ringProg').style.strokeDashoffset = offset;
    document.getElementById('ringPct').textContent = percent + '%';
    document.getElementById('legDone').textContent = done;
    document.getElementById('legLeft').textContent = left;
    document.getElementById('legTotal').textContent = total;
}

function updateBars(arr) {
    let barList = document.getElementById('barList');
    barList.innerHTML = '';

    if (!arr.length) {
        barList.innerHTML = '<div class="empty-state"><div class="empty-icon">📊</div>Нет привычек</div>';
        return;
    }

    arr.forEach(function (habit, i) {
        let width = habit.checked ? '100%' : '0%';
        let color = colors[i % colors.length];
        let pct = habit.checked ? '100%' : '0%';

        let row = document.createElement('div');
        row.className = 'bar-row';

        row.innerHTML =
            '<div class="bar-day">' + habit.name + '</div>' +
            '<div class="bar-track">' +
            '<div class="bar-fill" style="width:' + width + '; --bc:' + color + ';"></div>' +
            '</div>' +
            '<div class="bar-pct">' + pct + '</div>';

        barList.appendChild(row);
    });
}

function updateMiniList(arr) {
    let miniList = document.getElementById('miniList');
    miniList.innerHTML = '';

    if (!arr.length) {
        miniList.innerHTML = '<div style="color:var(--muted);font-size:.85rem;">Нет привычек</div>';
        return;
    }

    arr.forEach(function (habit) {
        let val = habit.checked ? '✅' : '⬜';

        let item = document.createElement('div');
        item.className = 'mini-item';

        item.innerHTML =
            '<span class="mini-name">' + habit.name + '</span>' +
            '<span class="mini-val">' + val + '</span>';

        miniList.appendChild(item);
    });
}

function updateStreakList(arr) {
    let streakList = document.getElementById('streakList');
    streakList.innerHTML = '';

    if (!arr.length) {
        streakList.innerHTML = '<div style="color:var(--muted);font-size:.85rem;">Нет привычек</div>';
        return;
    }

    arr.forEach(function (habit, i) {
        let color = colors[i % colors.length];
        let width = habit.checked ? '100%' : '0%';
        let streak = habit.checked ? 1 : 0;

        let row = document.createElement('div');
        row.className = 'streak-row';

        row.innerHTML = `
      <span class="mini-name" style="width:130px;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"> ${habit.name} </span>
      <div class="streak-bar-wrap">
      <div class="streak-bar" style="width:' + width + '; --sc:' + color + ';"></div>
      </div> 
      <span class="streak-num"> ${streak}</span>;`

        streakList.appendChild(row);
    });
}

function addHabit() {
    let input = document.getElementById('newHabitInput');
    let name = input.value.trim();

    if (!name) {
        input.focus();
        return;
    }

    let list = document.getElementById('habitsList');
    let count = list.querySelectorAll('.hcard').length;
    let delay = Math.min(count * 0.08, 0.44);

    let card = document.createElement('div');
    card.className = 'hcard fade-up';
    card.style.animationDelay = delay + 's';

    card.innerHTML = `
        <label class="chk">
        <input type="checkbox" />
        <span class="chk-mark">✓</span>
        </label>
        <div class="hinfo">
        <div class="hname"> ${name}  </div> 
        <div class="hstreak">🔥 0 дней подряд</div>
        </div>
        <button class="btn-del">✕ Удалить</button>`

    let checkbox = card.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', update);

    let delBtn = card.querySelector('.btn-del');
    delBtn.addEventListener('click', function () {
        card.classList.add('removing');
        setTimeout(function () {
            card.remove();
            update();
        }, 300);
    });

    list.appendChild(card);
    input.value = '';
    update();
}

let btnAdd = document.getElementById('btnAdd');
btnAdd.addEventListener('click', addHabit);

let newHabitInput = document.getElementById('newHabitInput');
newHabitInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') addHabit();
});

let existingCheckboxes = document.querySelectorAll('#habitsList .hcard input[type="checkbox"]');
existingCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', update);
});

let existingDelBtns = document.querySelectorAll('#habitsList .hcard .btn-del');
existingDelBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
        let card = btn.closest('.hcard');
        card.classList.add('removing');
        setTimeout(function () {
            card.remove();
            update();
        }, 300);
    });
});

update();
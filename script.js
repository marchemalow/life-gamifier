document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // -- ÉTAT INITIAL --
    let state = JSON.parse(localStorage.getItem('paradigm_rpg')) || {
        global: { lvl: 1, xp: 0 },
        academic: { lvl: 1, xp: 0 },
        creator: { lvl: 1, xp: 0 },
        copywriter: { lvl: 1, xp: 0 },
        money: 0,
        goal: 1200,
        goalName: "Sony ZV-E10",
        stamina: 100,
        pipeline: { idea: "...", script: "...", upload: "..." },
        quests: [
            { id: 1, text: "Réviser le chapitre 4", cat: "academic", done: false },
            { id: 2, text: "Dérushage vidéo YouTube", cat: "creator", done: false }
        ]
    };

    // -- FONCTIONS DE SAUVEGARDE --
    function save() {
        localStorage.setItem('paradigm_rpg', JSON.stringify(state));
        render();
    }

    // -- RENDU DE L'UI --
    function render() {
        // Global
        document.getElementById('global-lvl').innerText = state.global.lvl;
        document.getElementById('global-xp-bar').style.width = state.global.xp + '%';
        document.getElementById('global-xp-text').innerText = state.global.xp + '%';

        // Sub-levels
        ['academic', 'creator', 'copywriter'].forEach(c => {
            document.getElementById(`lvl-${c}`).innerText = 'LVL ' + state[c].lvl;
            document.getElementById(`xp-${c}`).style.width = state[c].xp + '%';
        });

        // Stamina
        document.getElementById('stamina-num').innerText = Math.floor(state.stamina);
        document.getElementById('stamina-circle').setAttribute('stroke-dasharray', `${state.stamina}, 100`);

        // Treasure
        document.getElementById('money-count').innerText = state.money;
        document.getElementById('money-bar').style.width = Math.min(100, (state.money / state.goal * 100)) + '%';
        document.getElementById('goal-val').innerText = state.goal;
        document.getElementById('goal-name').innerText = state.goalName;

        // Quests
        const qContainer = document.getElementById('quest-container');
        qContainer.innerHTML = '';
        state.quests.forEach(q => {
            const item = document.createElement('div');
            item.className = 'quest-item';
            item.innerHTML = `
                <input type="checkbox" ${q.done ? 'checked' : ''} onchange="toggleQuest(${q.id})">
                <span style="flex:1; ${q.done ? 'text-decoration:line-through; opacity:0.5' : ''}">${q.text}</span>
                <small class="${getCatColor(q.cat)}">${q.cat.toUpperCase()}</small>
            `;
            qContainer.appendChild(item);
        });

        // Pipeline
        document.getElementById('pipe-idea').innerText = state.pipeline.idea;
        document.getElementById('pipe-script').innerText = state.pipeline.script;
        document.getElementById('pipe-upload').innerText = state.pipeline.upload;
    }

    function getCatColor(cat) {
        if(cat === 'academic') return 'cyan';
        if(cat === 'creator') return 'orange';
        return 'pink';
    }

    // -- ACTIONS --
    window.toggleQuest = (id) => {
        const quest = state.quests.find(q => q.id === id);
        if(!quest.done) {
            quest.done = true;
            addXP(quest.cat, 20);
            addXP('global', 10);
        } else {
            quest.done = false;
        }
        save();
    };

    function addXP(cat, amt) {
        state[cat].xp += amt;
        if(state[cat].xp >= 100) {
            state[cat].xp = 0;
            state[cat].lvl++;
        }
    }

    window.updateMoney = (amt) => {
        state.money = Math.max(0, state.money + amt);
        save();
    };

    // -- GESTION FORMULAIRE QUÊTE --
    const addBtn = document.getElementById('add-quest-btn');
    const qForm = document.getElementById('quest-form');
    addBtn.onclick = () => qForm.classList.toggle('hidden');

    document.getElementById('confirm-quest').onclick = () => {
        const text = document.getElementById('quest-input').value;
        const cat = document.getElementById('quest-cat').value;
        if(text) {
            state.quests.push({ id: Date.now(), text, cat, done: false });
            document.getElementById('quest-input').value = '';
            qForm.classList.add('hidden');
            save();
        }
    };

    // -- PIPELINE EDITABLE --
    ['pipe-idea', 'pipe-script', 'pipe-upload'].forEach(id => {
        document.getElementById(id).addEventListener('blur', (e) => {
            const key = id.replace('pipe-', '');
            state.pipeline[key] = e.target.innerText;
            save();
        });
    });

    // -- SIMULATION STAMINA --
    setInterval(() => {
        if(state.stamina > 0) {
            state.stamina -= 0.01;
            document.getElementById('stamina-num').innerText = Math.floor(state.stamina);
            document.getElementById('stamina-circle').setAttribute('stroke-dasharray', `${state.stamina}, 100`);
        }
    }, 2000);

    render();
});
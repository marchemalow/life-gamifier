document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialisation des données (ou chargement depuis LocalStorage)
    let state = JSON.parse(localStorage.getItem('lifeRPG_data')) || {
        global: { lvl: 1, xp: 0 },
        academic: { lvl: 1, xp: 0 },
        creator: { lvl: 1, xp: 0 },
        copywriter: { lvl: 1, xp: 0 },
        money: 450,
        goalPrice: 1200,
        goalName: "Nouvelle Caméra",
        stamina: 100,
        pipeline: {
            idea: "Titre vidéo...",
            script: "En cours...",
            upload: "Fini..."
        },
        milestones: [
            { title: "Bac de Français", desc: "Mention TB" },
            { title: "1 000 Abonnés", desc: "Quête Légendaire" }
        ],
        completedQuests: [] // Stocke les IDs des quêtes faites aujourd'hui
    };

    const quests = [
        { id: 'q1', text: 'Réviser Philo / Maths', class: 'academic', icon: 'briefcase', xp: 20 },
        { id: 'q2', text: 'Script / Rec Vidéo', class: 'creator', icon: 'mic', xp: 25 },
        { id: 'q3', text: 'Rédaction Client A', class: 'copywriter', icon: 'feather', xp: 30 },
        { id: 'q4', text: 'Sport / Santé', class: 'global', icon: 'heart', xp: 15 }
    ];

    // 2. Fonctions de sauvegarde
    function save() {
        localStorage.setItem('lifeRPG_data', JSON.stringify(state));
        render();
    }

    // 3. Moteur de rendu (Mise à jour de l'UI)
    function render() {
        // Stats Globales
        document.getElementById('global-lvl').innerText = state.global.lvl;
        document.getElementById('global-xp-fill').style.width = state.global.xp + '%';

        // Sous-classes
        ['academic', 'creator', 'copywriter'].forEach(cls => {
            document.getElementById(`lvl-${cls}`).innerText = state[cls].lvl;
            document.getElementById(`xp-${cls}`).style.width = state[cls].xp + '%';
        });

        // Money & Goal
        document.getElementById('current-money').innerText = state.money + '€';
        document.getElementById('money-fill').style.width = (state.money / state.goalPrice * 100) + '%';
        document.getElementById('goal-name').innerText = state.goalName;
        document.getElementById('goal-price').innerText = state.goalPrice;

        // Pipeline
        document.getElementById('pipe-idea').innerText = state.pipeline.idea;
        document.getElementById('pipe-script').innerText = state.pipeline.script;
        document.getElementById('pipe-upload').innerText = state.pipeline.upload;

        // Stamina
        document.getElementById('stamina-fill').style.width = state.stamina + '%';
        document.getElementById('stamina-text').innerText = Math.floor(state.stamina) + '%';
    }

    // 4. Gestion des Quêtes
    const questContainer = document.getElementById('quest-list');
    function initQuests() {
        questContainer.innerHTML = '';
        quests.forEach(q => {
            const isChecked = state.completedQuests.includes(q.id);
            const div = document.createElement('div');
            div.className = `quest-item ${q.class}`;
            div.innerHTML = `
                <i data-lucide="${q.icon}"></i>
                <span style="flex:1">${q.text}</span>
                <input type="checkbox" ${isChecked ? 'checked' : ''} data-id="${q.id}">
            `;
            questContainer.appendChild(div);
        });
        lucide.createIcons();
    }

    questContainer.addEventListener('change', (e) => {
        const qId = e.target.getAttribute('data-id');
        const quest = quests.find(q => q.id === qId);

        if (e.target.checked) {
            state.completedQuests.push(qId);
            addXP(quest.class, quest.xp);
            addXP('global', quest.xp / 2);
        } else {
            state.completedQuests = state.completedQuests.filter(id => id !== qId);
            // On ne retire pas l'XP en mode RPG pour éviter la frustration, 
            // mais on pourrait logiciellement le faire ici.
        }
        save();
    });

    // 5. Logique RPG (Level Up)
    function addXP(category, amount) {
        state[category].xp += amount;
        if (state[category].xp >= 100) {
            state[category].xp -= 100;
            state[category].lvl += 1;
            showLevelUpEffect(category);
        }
    }

    function showLevelUpEffect(cat) {
        console.log(`LEVEL UP en ${cat} !`);
        // On pourrait ajouter une animation CSS ici
    }

    // 6. Trésor (Fonctions globales pour les boutons HTML)
    window.changeMoney = (val) => {
        state.money = Math.max(0, state.money + val);
        save();
    };

    // 7. Champs éditables (Sauvegarde en temps réel)
    const editableSelectors = [
        ['goal-name', 'goalName'], ['goal-price', 'goalPrice'],
        ['pipe-idea', 'pipeline', 'idea'], ['pipe-script', 'pipeline', 'script'],
        ['pipe-upload', 'pipeline', 'upload']
    ];

    editableSelectors.forEach(sel => {
        const el = document.getElementById(sel[0]);
        el.addEventListener('input', () => {
            if (sel.length === 3) {
                state[sel[1]][sel[2]] = el.innerText;
            } else {
                state[sel[1]] = el.innerText;
            }
            localStorage.setItem('lifeRPG_data', JSON.stringify(state));
        });
    });

    // 8. Décroissance Stamina
    setInterval(() => {
        if (state.stamina > 0) {
            state.stamina -= 0.05;
            render();
        }
    }, 5000);

    // Init au démarrage
    initQuests();
    render();
    lucide.createIcons();
});
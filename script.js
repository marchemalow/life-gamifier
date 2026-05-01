document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialisation des icônes Lucide (avec vérification de sécurité)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    } else {
        console.error("La bibliothèque Lucide n'est pas chargée.");
    }

    // 2. Sélection des éléments du DOM
    const checkboxes = document.querySelectorAll('.quest-item input[type="checkbox"]');
    const globalXpFill = document.querySelector('.xp-bar-fill');
    const globalLvlTag = document.getElementById('global-lvl');
    const staminaFill = document.getElementById('stamina-fill');
    const staminaText = document.getElementById('stamina-text');

    // 3. Variables d'état (Data)
    let currentXP = 65;
    let level = parseInt(globalLvlTag.innerText) || 14;
    let stamina = 75;

    // 4. Fonction de mise à jour de l'interface
    function updateUI() {
        if (globalXpFill) {
            globalXpFill.style.width = `${currentXP}%`;
        }
        if (globalLvlTag) {
            globalLvlTag.innerText = level;
        }
    }

    // 5. Gestionnaire de Quêtes (Gain d'EXP)
    checkboxes.forEach(box => {
        box.addEventListener('change', function() {
            const questItem = this.closest('.quest-item');
            
            if (this.checked) {
                // Effet visuel de complétion
                questItem.style.opacity = '0.4';
                questItem.style.filter = 'grayscale(100%)';
                
                // Calcul de l'XP
                currentXP += 15; // Gain par quête
                
                // Système de Level UP
                if (currentXP >= 100) {
                    currentXP -= 100;
                    level++;
                    // Petit effet visuel pour le level up
                    globalLvlTag.style.color = '#a855f7';
                    setTimeout(() => { globalLvlTag.style.color = '#e0e0e0'; }, 1000);
                    console.log(`Level Up! Nouveau niveau : ${level}`);
                }
            } else {
                // Annulation
                questItem.style.opacity = '1';
                questItem.style.filter = 'none';
                currentXP = Math.max(0, currentXP - 15);
            }
            updateUI();
        });
    });

    // 6. Système de Stamina (Décroissance en temps réel)
    const staminaInterval = setInterval(() => {
        if (stamina > 0) {
            stamina -= 0.1; // Baisse lente de l'énergie
            
            if (staminaFill) {
                staminaFill.style.width = `${stamina}%`;
                
                // Alerte visuelle si Stamina basse (Danger de Burn-out)
                if (stamina < 20) {
                    staminaFill.style.background = 'linear-gradient(90deg, #ff0000, #ff4d4d)';
                    staminaFill.style.boxShadow = '0 0 15px #ff0000';
                } else {
                    staminaFill.style.background = 'linear-gradient(90deg, #ff4d4d, #f9cb28)';
                    staminaFill.style.boxShadow = 'none';
                }
            }
            
            if (staminaText) {
                staminaText.innerText = `Énergie : ${Math.floor(stamina)}%`;
            }
        } else {
            // Plus d'énergie
            staminaText.innerText = "Burn-out ! Repos obligatoire.";
        }
    }, 3000); // Mise à jour toutes les 3 secondes pour fluidité

});
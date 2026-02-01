// Configuration
const POLL_INTERVAL = 30000; // 30 secondes
const DISRUPTIONS_URL = 'data/disruptions.json';

// État de l'application
let lastSeenCheck = null;
let notificationsEnabled = false;
let serviceWorkerRegistration = null;

// Éléments du DOM
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const enableButton = document.getElementById('enableNotifications');
const disruptionsList = document.getElementById('disruptionsList');
const lastCheckElement = document.getElementById('lastCheck');

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Application IDFM Notifications démarrée');

    // Vérifier le support des notifications
    if (!('Notification' in window)) {
        statusText.textContent = 'Notifications non supportées par ce navigateur';
        enableButton.disabled = true;
        return;
    }

    // Vérifier le support des Service Workers
    if (!('serviceWorker' in navigator)) {
        statusText.textContent = 'Service Workers non supportés';
        enableButton.disabled = true;
        return;
    }

    // Enregistrer le Service Worker
    registerServiceWorker();

    // Gérer le clic sur le bouton d'activation
    enableButton.addEventListener('click', handleEnableNotifications);

    // Vérifier l'état initial des permissions
    checkNotificationPermission();

    // Charger les perturbations immédiatement
    fetchDisruptions();

    // Démarrer le polling
    setInterval(fetchDisruptions, POLL_INTERVAL);
});

// Enregistrer le Service Worker
async function registerServiceWorker() {
    try {
        serviceWorkerRegistration = await navigator.serviceWorker.register('service-worker.js');
        console.log('✅ Service Worker enregistré:', serviceWorkerRegistration);
    } catch (error) {
        console.error('❌ Erreur lors de l\'enregistrement du Service Worker:', error);
        statusText.textContent = 'Erreur lors de l\'initialisation';
    }
}

// Vérifier l'état des permissions de notification
function checkNotificationPermission() {
    const permission = Notification.permission;

    if (permission === 'granted') {
        notificationsEnabled = true;
        updateNotificationStatus(true, 'Notifications activées');
        enableButton.textContent = 'Notifications activées ✓';
        enableButton.disabled = true;
    } else if (permission === 'denied') {
        updateNotificationStatus(false, 'Notifications refusées');
        enableButton.textContent = 'Notifications refusées';
        enableButton.disabled = true;
    } else {
        updateNotificationStatus(false, 'Notifications désactivées');
        enableButton.textContent = 'Activer les notifications';
        enableButton.disabled = false;
    }
}

// Gérer l'activation des notifications
async function handleEnableNotifications() {
    try {
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            notificationsEnabled = true;
            updateNotificationStatus(true, 'Notifications activées');
            enableButton.textContent = 'Notifications activées ✓';
            enableButton.disabled = true;

            // Test de notification
            showTestNotification();
        } else {
            updateNotificationStatus(false, 'Notifications refusées');
            enableButton.textContent = 'Notifications refusées';
            enableButton.disabled = true;
        }
    } catch (error) {
        console.error('❌ Erreur lors de la demande de permission:', error);
    }
}

// Mettre à jour l'indicateur de statut
function updateNotificationStatus(active, text) {
    if (active) {
        statusDot.classList.add('active');
    } else {
        statusDot.classList.remove('active');
    }
    statusText.textContent = text;
}

// Afficher une notification de test
function showTestNotification() {
    if (serviceWorkerRegistration) {
        serviceWorkerRegistration.showNotification('Notifications activées', {
            body: 'Vous recevrez désormais des alertes pour les perturbations sur la ligne C01382',
            icon: 'https://via.placeholder.com/192',
            badge: 'https://via.placeholder.com/96',
            tag: 'test-notification'
        });
    }
}

// Récupérer les perturbations depuis le fichier JSON
async function fetchDisruptions() {
    try {
        // Ajouter un timestamp pour éviter le cache
        const url = `${DISRUPTIONS_URL}?t=${Date.now()}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        // Mettre à jour l'interface
        updateLastCheck(data.lastCheck);
        displayDisruptions(data.disruptions);

        // Vérifier si de nouvelles perturbations sont apparues
        if (data.hasNewDisruptions && data.lastCheck !== lastSeenCheck) {
            console.log('🚨 Nouvelles perturbations détectées!');

            if (notificationsEnabled) {
                notifyNewDisruptions(data.disruptions);
            }

            lastSeenCheck = data.lastCheck;
        }

    } catch (error) {
        console.error('❌ Erreur lors du chargement des perturbations:', error);
        disruptionsList.innerHTML = '<div class="no-disruptions" style="color: #ef4444;">Erreur de chargement</div>';
    }
}

// Mettre à jour l'heure de la dernière vérification
function updateLastCheck(timestamp) {
    if (!timestamp) {
        lastCheckElement.textContent = 'Dernière vérification: jamais';
        return;
    }

    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    let timeText;
    if (diffMins < 1) {
        timeText = 'à l\'instant';
    } else if (diffMins === 1) {
        timeText = 'il y a 1 minute';
    } else if (diffMins < 60) {
        timeText = `il y a ${diffMins} minutes`;
    } else {
        timeText = date.toLocaleString('fr-FR');
    }

    lastCheckElement.textContent = `Dernière vérification: ${timeText}`;
}

// Afficher les perturbations dans l'interface
function displayDisruptions(disruptions) {
    if (!disruptions || disruptions.length === 0) {
        disruptionsList.innerHTML = '<div class="no-disruptions">Aucune perturbation en cours</div>';
        return;
    }

    disruptionsList.innerHTML = disruptions.map(disruption => {
        const severityClass = disruption.severity.toLowerCase().replace(/\s+/g, '-');
        const messages = disruption.messages
            .map(msg => msg.text)
            .filter(text => text)
            .join(' ');

        return `
            <div class="disruption-card">
                <span class="severity ${severityClass}">${disruption.severity}</span>
                <div class="disruption-message">
                    ${messages || 'Aucun détail disponible'}
                </div>
            </div>
        `;
    }).join('');
}

// Envoyer une notification pour les nouvelles perturbations
function notifyNewDisruptions(disruptions) {
    if (!serviceWorkerRegistration || !notificationsEnabled) {
        return;
    }

    // Envoyer un message au Service Worker
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'NEW_DISRUPTION',
            disruptions: disruptions
        });
    } else {
        // Fallback: afficher directement la notification
        const count = disruptions.length;
        const title = count === 1 ? 'Nouvelle perturbation IDFM' : `${count} nouvelles perturbations IDFM`;
        const body = disruptions[0].messages[0]?.text || 'Perturbation détectée sur la ligne C01382';

        serviceWorkerRegistration.showNotification(title, {
            body: body,
            icon: 'https://via.placeholder.com/192',
            badge: 'https://via.placeholder.com/96',
            tag: 'idfm-disruption',
            requireInteraction: true,
            data: {
                url: window.location.href
            }
        });
    }
}

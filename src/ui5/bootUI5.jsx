export default async function bootUI5(document, { theme = 'sap_horizon' }) {
    // Load UI5
    return new Promise((res, rej) => {
        const ui5Script = document.createElement('script');
        ui5Script.id = 'sap-ui-bootstrap';
        ui5Script.src = '/resources/sap-ui-core.js';
        ui5Script.setAttribute('data-sap-ui-theme', theme);
        ui5Script.setAttribute('data-sap-ui-async', 'true');
        ui5Script.addEventListener('load', () => {
            sap.ui.getCore().attachInit(() => {
                res();
            });
        });
        ui5Script.addEventListener('error', (err) => {
            console.error('Error loading UI5:', err);
            rej(err);
        });
        document.head.appendChild(ui5Script);
    });
}   
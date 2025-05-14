document.addEventListener('DOMContentLoaded', async () => {
    const topbarMenu = document.getElementById('topbar-menu');
    const topbarLinks = document.getElementById('topbar-links');
    const topbarDropdown = document.getElementById('topbar-dropdown');

    async function changeLayout() {
        if (window.innerWidth < 720) {
            topbarMenu.style.display = '';

            for (const element of topbarLinks.children) {
                if (element.className != 'button' && element instanceof HTMLAnchorElement)
                    element.style.display = 'none';
            }

        } else {
            topbarMenu.innerHTML = '<i class="fa-solid fa-bars"></i>';
            topbarMenu.style.display = 'none';
            topbarDropdown.style.display = 'none';
            setTimeout(() => {
                topbarDropdown.style.transform = 'translateY(-100%)';
            }, 1);

            for (const element of topbarLinks.children) {
                if (element.className != 'button' && element instanceof HTMLAnchorElement)
                    element.style.display = '';
            }
        }
    }

    window.onresize = changeLayout;
    changeLayout();

    topbarMenu.addEventListener('click', async (event) => {
        if (topbarDropdown.style.display != 'flex') {
            topbarDropdown.style.display = 'flex';
            setTimeout(() => {
                topbarDropdown.style.transform = 'translateY(0px)';
            }, 1);

            topbarMenu.innerHTML = '<i class="fa-solid fa-bars-staggered"></i>';
        } else {
            topbarDropdown.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                topbarDropdown.style.display = 'none';
            }, 300);

            topbarMenu.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    });

    const data = await fetch('https://api1.projectauto.xyz/data/executors');
    const upData = await fetch('https://whatexpsare.online/api/status/exploits', {
        headers: { 'user-agent': 'WEAO-3PService' }
    });

    const json = await data.json();
    const upJson = await upData.json();

    if (!json.success)
        return console.warn('error occured with executor api');

    const windowsExecutorsGrid = document.querySelector('.executors-windows .executor-grid');
    const macExecutorsGrid = document.querySelector('.executors-mac .executor-grid');
    const androidExecutorsGrid = document.querySelector('.executors-android .executor-grid');
    const iosExecutorsGrid = document.querySelector('.executors-ios .executor-grid');

    json.executors.forEach(data => {
        var updated = null;
        if (data.upId)
            updated = upJson.find(data1 => data1._id == data.upId).updateStatus;

        const box = document.createElement('div');
        box.className = 'executor-box';
        box.style.border = `1px solid var(--executor-${updated == null? 'unknown' : (updated? 'updated' : 'down')})`;

        const name = document.createElement('h1');
        name.className = 'executor-name';
        name.textContent = data.name;
        box.appendChild(name);

        const info = document.createElement('p');
        info.className = 'executor-info';
        box.appendChild(info);
        info.innerHTML = `
            <i class="fa-solid fa-dollar-sign"></i>
            ${data.price}
            <br>
            <i class="fa-solid fa-${updated == null? 'question' : (updated? 'check' : 'xmark')}"></i>
            Updated
            <br>
            <i class="fa-solid fa-${['xmark', 'check', 'question'][data.supported]}"></i>
            Scripts Fully Supported
        `;

        const buttons = document.createElement('div');
        buttons.className = 'executor-buttons';
        box.appendChild(buttons);

        const button = document.createElement('a');
        button.className = 'button';
        button.target = '_blank';

        if (data.site) {
            const button1 = button.cloneNode();
            buttons.appendChild(button1);
            button1.href = data.site;
            button1.textContent = 'Website';
        }

        if (data.discord) {
            const button1 = button.cloneNode();
            buttons.appendChild(button1);
            button1.href = data.discord;
            button1.textContent = 'Discord';
        }

        if (data.download) {
            const button1 = button.cloneNode();
            buttons.appendChild(button1);
            button1.href = data.download;
            button1.textContent = 'Download';
        }

        switch (data.platform) {
            case 'windows':
                windowsExecutorsGrid.appendChild(box);
                break;
            case 'android':
                androidExecutorsGrid.appendChild(box);
                break;
            case 'mac':
                macExecutorsGrid.appendChild(box);
                break;
            case 'ios':
                iosExecutorsGrid.appendChild(box);
                break;
        }
    });

    if (localStorage.getItem('AUTH_TOKEN')) {
        const button = document.getElementById('login-button');
        button.href = '/dashboard/home';
        button.innerText = 'Dashboard';
    }
});
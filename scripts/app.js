import cluster from './cluster.js';

class App {
    run() {
        cluster.create();
        this.addListeners();
    }

    lock() {
        const pages = document.querySelector('.pages');
        const warning = document.querySelector('.warning');
        pages.classList.add('invisible');
        warning.classList.remove('invisible');
    }


    addListeners() {
        const startForm = document.querySelector('.js-start-form');
        const addObjectForm = document.querySelector('.js-add-object');
        const delOSDForm = document.querySelector('.js-del-osd');

        // cluster.start(2, [4, 5], [3, 3]);
        // cluster.addObject(0, 1);
        // cluster.addObject(0, 2);
        // setTimeout(() => {
        //     cluster.delOSD(0, 0);
        //     cluster.delOSD(0, 1);
        //     // cluster.delOSD(0, 2);
        //     // cluster.delOSD(0, 3);
        // }, 1000);
        delOSDForm.addEventListener('submit', this.delOSDCallback);
        startForm.addEventListener('submit', this.startCallback);
        addObjectForm.addEventListener('submit', this.addObjectCallback);
    }

    delOSDCallback(event) {
        event.preventDefault();
        const form = event.target;

        removeErrorsInForm(form);

        const formObj = formToObject(form);
        let isValid = true;

        const poolind = Number(formObj['poolind']);
        if (!formObj['poolind'].trim() || poolind < 0 || poolind >= cluster.pools.length) {
            addErrorToForm(form, 'poolind')
            isValid = false;
        }

        const osdind = Number(formObj['osdind']);
        if (!formObj['osdind'].trim() || osdind < 0 || osdind >= cluster.pools[poolind].OSDs.length) {
            addErrorToForm(form, 'osdind')
            isValid = false;
        }

        if (isValid) {
            cluster.delOSD(poolind, osdind);
        }
    }

    addObjectCallback(event) {
        event.preventDefault();
        const addObjectForm = event.target;
        removeErrorsInForm(addObjectForm);

        const formObj = formToObject(addObjectForm);

        let isValid = true;

        const poolind = Number(formObj['poolind']);
        if (!formObj['poolind'].trim() || poolind < 0 || poolind >= cluster.pools.length) {
            addErrorToForm(addObjectForm, 'poolind')
            isValid = false;
        }

        const objectid = Number(formObj['objectid']);
        if (!formObj['objectid'].trim() || objectid < 0 || cluster.existObject(objectid)) {
            addErrorToForm(addObjectForm, 'objectid')
            isValid = false;
        }

        if (isValid) {
            cluster.addObject(poolind, objectid);
        }
    }

    startCallback(event) {
        event.preventDefault();
        const startForm = event.target;
        removeErrorsInForm(startForm);

        const formObj = formToObject(startForm);

        let isValid = true;

        const cntPools = Number(formObj['pools']);
        if (!formObj['pools'].trim() || cntPools < 1 || cntPools > 5) {
            addErrorToForm(startForm, 'pools')
            isValid = false;
        }

        const checkArray = (inputName) => {
            const array = formObj[inputName].split(',');
            if (array.length != cntPools) {
                addErrorToForm(startForm, inputName)
                isValid = false;
            }
            const intArray = array.map(item => {
                let num = Number(item)
                if (isNaN(num)) {
                    addErrorToForm(startForm, inputName)
                    isValid = false;
                }
                return num
            })

            return intArray;
        }

        const osds = checkArray('osds');
        const rfs = checkArray('rfs');
        osds.forEach(item => {
            if (item < 1 || item > 10) {
                addErrorToForm(startForm, 'osds')
                isValid = false;
            }
        })
        rfs.forEach((item, ind) => {
            if (item < 1 || item > 5 || osds[ind] < item) {
                addErrorToForm(startForm, 'rfs')
                isValid = false;
            }
        })

        if (isValid) {
            cluster.start(cntPools, osds, rfs);
            const addObjectForm = document.querySelector('.page-2')
            addObjectForm.classList.remove('invisible');
            startForm.classList.add('invisible');
        }
    }
}

const app = new App()
export default app;

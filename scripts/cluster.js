import app from './app.js';
import canvas from './canvas.js';
import { Pool } from './pool.js';

class Cluster {
    constructor() {
        this.up = true;
    }

    create() {
        canvas.startDraw();
    }

    down() {
        this.up = false;
        app.lock();
        const params = document.querySelector('.params');
    }

    start(cntPools, osds, rfs) {
        this.pools = [];
        for (let i = 0; i < cntPools; ++i) {
            this.pools.push(new Pool(i, osds[i], rfs[i]));
        }
        canvas.drawCluster();
    }

    getPoolInd(pool) {
        return cluster.pools.indexOf(pool);
    }

    hashObject(id) {
        return id;
    }

    addObject(poolInd, id) {
        this.pools[poolInd].addObject(this.hashObject(id));
    }

    existObject(id) {
        return this.pools.some(pool => {
            return pool.OSDs.some(osd => {
                return osd.objects.some(obj => {
                    if (obj.id == id) {
                        return true;
                    }
                })
            })
        })
    }

    delOSD(poolInd, osdInd) {
        this.pools[poolInd].delOSD(osdInd);
    }
}

const cluster = new Cluster()
export default cluster;

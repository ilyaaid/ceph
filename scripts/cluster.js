import canvas from './canvas.js';
import { Pool } from './pool.js';

class Cluster {
    constructor() {
    }

    create() {
        canvas.startDraw();
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

    addObject(poolInd, id) {
        this.pools[poolInd].addObject(id);
    }

    delOSD(poolInd, osdInd) {
        this.pools[poolInd].delOSD(osdInd);
    }
}

const cluster = new Cluster()
export default cluster;

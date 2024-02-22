import cluster from './cluster.js';
import { Pool } from './pool.js';

class Canvas {
    constructor() {
        let canvasEl = document.getElementById('canvas');
        this.canvas = new fabric.Canvas('canvas', {
            fireRightClick: true,
            fireMiddleClick: true,
            stopContextMenu: true,
            hoverCursor: 'click',
            width: canvasEl.clientWidth,
            height: canvasEl.clientHeight,
            selection: false,
        });
        this.pool2ind = {};
        this.levels = [10, 100, 200, 500];
        this.visPool = {
            ind: 0,
            objects: [],
        };
    }

    getControlsVisibilityObj() {
        return {
            bl: false,
            br: false,
            mb: false,
            ml: false,
            mr: false,
            mt: false,
            tl: false,
            tr: false,
            mtr: false
        };
    }

    startDraw() {
        const text = new fabric.Text('Client', {
            fontFamily: 'Nunito Sans',
            fontWeight: 600,
            fontSize: 20,
            originX: 'center',
            originY: 'center'
        });
        const border = new fabric.Rect({
            fill: '#ffffff',
            height: text.height + 10,
            width: text.width + 15,
            originX: 'center',
            originY: 'center'
        });
        const group = new fabric.Group([border, text], {
            originX: 'left',
            originY: 'top',
            hasRotatingPoint: false,
            top: this.levels[0],
            left: this.canvas.width / 2,
            selectable: false
        });
        group.left -= group.width / 2;
        this.client = group;
        this.canvas.add(group);
    }

    drawCluster() {
        this.drawPools();
        this.drawPGs(0) // DELETE
    }

    drawPools() {
        let sumWidth = 0;
        for (let i = 0; i < cluster.pools.length; ++i) {
            const pool = cluster.pools[i];
            pool.setVisibilityControl();

            sumWidth += pool.fobj.width;
            this.pool2ind[pool] = i;
        }

        let margin = 20;
        sumWidth += margin * (cluster.pools.length - 1);
        let beginLeft = (this.canvas.width - sumWidth) / 2;
        for (let i = 0; i < cluster.pools.length; ++i) {
            cluster.pools[i].setPos(beginLeft, this.levels[1])
            beginLeft += cluster.pools[i].fobj.width + margin;
            const line = new fabric.Line([
                this.client.left + this.client.width / 2, this.client.top + this.client.height,
                cluster.pools[i].fobj.left + cluster.pools[i].fobj.width / 2, cluster.pools[i].fobj.top
            ], {
                stroke: 'grey',
                strokeWidth: 3,
                selectable: false,
                evented: false,
            })
            this.canvas.add(line);
            this.canvas.add(cluster.pools[i].fobj);
        }
    }

    drawPool(ind) {
        if (this.visPool.ind != ind && this.visPool.objects.length > 0) {
            this.visPool.objects.forEach(item => this.canvas.remove(item));
        }
        if (this.visPool.ind != ind) {
            this.drawPGs(ind)
            this.visPool.ind = ind;
        }
    }

    drawPGs(poolInd) {
        const pool = cluster.pools[poolInd];
        let sumWidth = 0;
        pool.PGs.forEach((item) => {
            sumWidth += item.fobj.width;
        });

        let margin = 10;
        sumWidth += margin * (pool.PGs.length - 1);
        let beginLeft = (this.canvas.width - sumWidth) / 2;
        for (let i = 0; i < pool.PGs.length; ++i) {
            const fpg = pool.PGs[i].fobj;
            fpg.left = beginLeft;
            fpg.top = this.levels[2];
            beginLeft += fpg.width + margin;
            const line = new fabric.Line([
                pool.fobj.left + pool.fobj.width / 2, pool.fobj.top + pool.fobj.height,
                fpg.left + fpg.width / 2, fpg.top
            ], {
                stroke: 'grey',
                strokeWidth: 1,
                selectable: false,
                evented: false,
            })
            this.addVisPoolObj(line);
            this.addVisPoolObj(fpg);
        }

        this.drawOSDs(poolInd);
    }

    drawOSDs(poolInd) {
        const pool = cluster.pools[poolInd];
        let sumWidth = 0;
        pool.OSDs.forEach((item) => {
            sumWidth += item.fobj.width;
        });

        let margin = 20;
        sumWidth += margin * (pool.OSDs.length - 1);
        let beginLeft = (this.canvas.width - sumWidth) / 2;
        for (let i = 0; i < pool.OSDs.length; ++i) {
            const fosd = pool.OSDs[i].fobj;
            fosd.left = beginLeft;
            fosd.top = this.levels[3];
            beginLeft += fosd.width + margin;
            pool.OSDs[i].PGs.forEach(item => {
                const { primaryOSD } = pool.PGs[item];
                const fpg = pool.PGs[item].fobj;

                const line = new fabric.Line([
                    fpg.left + fpg.width / 2, fpg.top + fpg.height,
                    fosd.left + fosd.width / 2, fosd.top
                ], {
                    stroke: 'grey',
                    strokeWidth: 1,
                    selectable: false,
                    evented: false,
                })
                if (i == primaryOSD) {
                    line.stroke = 'black';
                }
                this.addVisPoolObj(line);
            })

            this.addVisPoolObj(fosd);
        }
    }

    removeVisPoolObj(obj) {
        this.canvas.remove(obj);
    }

    addVisPoolObj(obj) {
        this.visPool.objects.push(obj);
        this.canvas.add(obj);
    }

    addObject(pool, id) {
        const pg = pool.PGs[id % pool.PGs.length];
        const text = new fabric.Text('' + id, {
            fontFamily: 'Nunito Sans',
            fontWeight: 600,
            fontSize: 8,
            originX: 'center',
            originY: 'center'
        });
        const border = new fabric.Circle({
            radius: text.width / 2 + 5,
            fill: '#039BE5',
            left: 0,
            originX: 'center',
            originY: 'center'
        });
        const obj = new fabric.Group([border, text], {
            originX: 'left',
            originY: 'top',
            hasRotatingPoint: false,
            top: this.levels[0],
            selectable: false
        });
        const fPrimOSD = pool.OSDs[pg.primaryOSD].fobj;
        let path = [
            {
                left: this.client.left + this.client.width / 2 - obj.width / 2,
                top: this.client.top + this.client.height - obj.height / 2,
            },
            {
                left: pool.fobj.left + pool.fobj.width / 2 - obj.width / 2,
                top: pool.fobj.top - obj.height / 2,
            },
            {
                left: pool.fobj.left + pool.fobj.width / 2 - obj.width / 2,
                top: pool.fobj.top + pool.fobj.height - obj.height / 2,
            },
            {
                left: pg.fobj.left + pg.fobj.width / 2 - obj.width / 2,
                top: pg.fobj.top - obj.height / 2,
            },
            {
                left: pg.fobj.left + pg.fobj.width / 2 - obj.width / 2,
                top: pg.fobj.top + pg.fobj.height - obj.height / 2,
            },
            {
                left: fPrimOSD.left + fPrimOSD.width / 2 - obj.width / 2,
                top: fPrimOSD.top - obj.height / 2
            }
        ];
        if (this.visPool.ind != cluster.getPoolInd(pool)) {
            path = path.slice(0, -3);
        }
        obj.left = path[0].left;
        obj.top = path[0].top;
        this.canvas.add(obj);

        const speed = 1;
        let nextPathInd = 1;
        const animate = () => {
            if (nextPathInd == path.length) {
                this.canvas.remove(obj);
                pg.osds.forEach(item => {
                    pool.OSDs[item].addObject(pool, id);
                })
            } else {
                let leftstep = (path[nextPathInd].left - obj.left) / ((path[nextPathInd].top - obj.top) / speed);
                obj.top += speed;
                obj.left += leftstep;
                if (obj.top >= path[nextPathInd].top) {
                    nextPathInd++;
                }

                this.canvas.renderAll();
                fabric.util.requestAnimFrame(animate);
            }
        };
        animate();
    }
}

const canvas = new Canvas();
export default canvas;

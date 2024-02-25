import canvas from './canvas.js';
import cluster from './cluster.js';
import { OSD } from './osd.js';

export class Pool {
    constructor(ind, cntOsds, rf) {
        this.create(ind);
        this.PGs = [];
        this.OSDs = [];
        this.createOSDs(cntOsds, rf);
    }

    create(ind) {
        const text = new fabric.Text('Pool (index=' + ind + ')', {
            fontFamily: 'Nunito Sans',
            fontWeight: 500,
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

        // Создаю объект pool в canvas
        this.fobj = new fabric.Group([border, text], {
            originX: 'left',
            originY: 'top',
            hasRotatingPoint: false,
            lockRotation: true,
            lockMovementX: true,
            lockMovementY: true,
            hasControls: true,
            poolInd: ind,
        });
        this.fobj.setControlsVisibility(canvas.getControlsVisibilityObj())
    }

    createOSDs(cnt, rf) {
        for (let i = 0; i < cnt; ++i) {
            this.OSDs.push(new OSD(i));
        }

        let cntPGs = this.getPGsCnt(cnt);
        for (let i = 0; i < cntPGs; ++i) {
            const pg = {
                ind: i,
                osds: [],
                primaryOSD: undefined,
            }

            let primary = Math.floor(Math.random() * rf);
            let selectcnt = cnt;
            let selectosds = [];
            for (let j = 0; j < cnt; ++j) {
                selectosds.push(j);
            }
            for (let j = 0; j < rf; ++j) {
                let randInd = Math.floor(Math.random() * selectcnt)
                selectcnt--;
                pg.osds.push(selectosds[randInd]);
                this.OSDs[selectosds[randInd]].addPG(i);
                selectosds.splice(randInd, 1);
            }
            pg.primaryOSD = pg.osds[primary];

            this.PGs.push(pg);
        }
        this.createFPGs();
    }

    createFPGs() {
        this.PGs.forEach((item, ind) => {
            const text = new fabric.Text('PG ' + ind, {
                fontFamily: 'Nunito Sans',
                fontWeight: 500,
                fontSize: 15,
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

            // Создаю объект PG в canvas
            item.fobj = new fabric.Group([border, text], {
                originX: 'left',
                originY: 'top',
                hasRotatingPoint: false,
                lockRotation: true,
                lockMovementX: true,
                lockMovementY: true,
                hasControls: true,
                selectable: false
            });
        })
    }

    getPGsCnt(cntOsd) {
        return cntOsd * 2;
    }

    setPos(left, top) {
        this.fobj.left = left;
        this.fobj.top = top;
    }

    setVisibilityControl() {
        const deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3C!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --%3E%3Csvg width='800px' height='800px' viewBox='0 -4 20 20' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3Eview_simple %5B%23815%5D%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cdefs%3E%3C/defs%3E%3Cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='Dribbble-Light-Preview' transform='translate(-260.000000, -4563.000000)' fill='%23000000'%3E%3Cg id='icons' transform='translate(56.000000, 160.000000)'%3E%3Cpath d='M216,4409.00052 C216,4410.14768 215.105,4411.07682 214,4411.07682 C212.895,4411.07682 212,4410.14768 212,4409.00052 C212,4407.85336 212.895,4406.92421 214,4406.92421 C215.105,4406.92421 216,4407.85336 216,4409.00052 M214,4412.9237 C211.011,4412.9237 208.195,4411.44744 206.399,4409.00052 C208.195,4406.55359 211.011,4405.0763 214,4405.0763 C216.989,4405.0763 219.805,4406.55359 221.601,4409.00052 C219.805,4411.44744 216.989,4412.9237 214,4412.9237 M214,4403 C209.724,4403 205.999,4405.41682 204,4409.00052 C205.999,4412.58422 209.724,4415 214,4415 C218.276,4415 222.001,4412.58422 224,4409.00052 C222.001,4405.41682 218.276,4403 214,4403' id='view_simple-%5B%23815%5D'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
        const img = document.createElement('img');
        img.src = deleteIcon;

        this.fobj.controls.viewTreeControl = new fabric.Control({
            x: 0.5,
            y: -1,
            offsetY: 16,
            cursorStyle: 'pointer',
            mouseUpHandler: visPool.bind(this),
            render: renderIcon,
            cornerSize: 24
        });

        function visPool(eventData, transform) {
            const target = transform.target;
            canvas.drawPool(target.poolInd);
        }

        function renderIcon(ctx, left, top, styleOverride, fabricObject) {
            const size = this.cornerSize;
            ctx.save();
            ctx.translate(left, top);
            ctx.drawImage(img, -size / 2, -size / 2, size, size);
            ctx.restore();
        }
    }


    // existObject(id) {
    //     return this.OSDs.some(osd => {
    //         return osd.objects.some(obj => {
    //             if (obj.id == id) {
    //                 return true;
    //             }
    //         })
    //     })
    // }

    existWorkingOSD() {
        return this.OSDs.some(item => {
            if (item.working) {
                return true;
            }
        })
    }

    addObject(id) {
        canvas.addObject(this, id);
    }

    delOSD(osdind) {
        const osd = this.OSDs[osdind];
        // сначала перекинуть все связи с плейсмент группами на другие osd, учесть primaryOSD
        osd.PGs.forEach(pgind => {
            const pg = this.PGs[pgind];
            const ind = pg.osds.indexOf(osdind);
            const temposd = [];
            for (let i = 0; i < this.OSDs.length; ++i) {
                if (this.OSDs[i].working && !pg.osds.includes(i)) {
                    temposd.push(i);
                }
            }
            pg.osds.splice(ind, 1);

            if (temposd.length > 0) {
                let newosdind = Math.floor(Math.random() * temposd.length);
                pg.osds.push(temposd[newosdind]);
                this.OSDs[temposd[newosdind]].addPG(pgind);
            }

            if (pg.primaryOSD == osdind) {
                pg.primaryOSD = pg.osds[Math.floor(Math.random() * pg.osds.length)];
                if (pg.primaryOSD === undefined) {
                    // cluster.down();
                }
            }
        });
        osd.PGs = [];

        // затем пройтись по объектам osd и каждый объект перекинуть в нужные osd
        console.log(this.PGs);
        osd.objects.forEach(item => {
            this.PGs[item.pgInd].osds.forEach(osdind => {
                this.OSDs[osdind].addObject(this, item.id);
            });
        });

        osd.objects = [];
        osd.delete(this);
        // отрисовать итоговую картину кластера
        if (canvas.visPool.ind == cluster.getPoolInd(this)) {
            canvas.drawPool(cluster.getPoolInd(this));
        }
    }
}

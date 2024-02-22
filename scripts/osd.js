import canvas from './canvas.js';
import cluster from './cluster.js';

export class OSD {
    constructor(ind) {
        this.ind = ind;
        this.PGs = [];
        this.objects = [];
        this.create('OSD' + ind)
    }

    addObject(pool, id) {
        this.objects.push({
            poolInd: cluster.getPoolInd(pool),
            pgInd: id % pool.PGs.length,
            id: id,
        });
        this.recreate(pool);
    }

    addPG(ind) {
        this.PGs.push(ind);
    }

    delOSD() {
        
    }

    recreate(pool) {
        const poolInd = cluster.getPoolInd(pool);
        if (poolInd == canvas.visPool.ind) {
            canvas.removeVisPoolObj(this.fobj);
        }
        const { left, top } = this.fobj;
        let datastr = 'OSD' + this.ind;
        this.objects.forEach(obj => {
            datastr += '\n' + '====';
            datastr += '\n' + 'OBJ:' + '\n' + 'id:' + obj.id + '\n' + 'pg:' + obj.pgInd + '\n' + 'pool:' + obj.poolInd;
        })
        this.create(datastr);
        this.fobj.left = left;
        this.fobj.top = top;

        if (poolInd == canvas.visPool.ind) {
            canvas.addVisPoolObj(this.fobj);
        }
    }

    create(datastr) {
        const text = new fabric.Text(datastr, {
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

        // Создаю объект pool в canvas
        this.fobj = new fabric.Group([border, text], {
            originX: 'left',
            originY: 'top',
            hasRotatingPoint: false,
            lockRotation: true,
            lockMovementX: true,
            lockMovementY: true,
            hasControls: true,
            selectable: false,
        });
    }
}

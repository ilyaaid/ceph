import canvas from './canvas.js';
import cluster from './cluster.js';

export class OSD {
    constructor(ind) {
        this.working = true;
        this.ind = ind;
        this.PGs = [];
        this.objects = [];
        this.create('OSD' + ind)
    }

    existObject(id) {
        return this.objects.some(obj => {
            if (obj.id == id) {
                return true;
            }
        })
    }

    addObject(pool, id) {
        if (!this.existObject(id)) {
            this.objects.push({
                poolInd: cluster.getPoolInd(pool),
                pgInd: id % pool.PGs.length,
                id: id,
            });
            this.recreate(pool);
        }
    }

    addPG(ind) {
        this.PGs.push(ind);
    }

    delete(pool) {
        this.working = false;
        this.recreate(pool);
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
            // datastr += '\n' + 'OBJ:';
            datastr += '\n' + 'id:' + obj.id;
            datastr += '\n' + 'pg:' + obj.pgInd;
            // datastr += '\n' + 'pool:' + obj.poolInd;
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
            fill: this.working ? '#ffffff' : '#ffbf5d',
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

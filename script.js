const TWO_PI = 2 * Math.PI

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

const canvasColor = '#232332'
const stepLength = 2
const maxOffset = 6

let w = canvas.width = innerWidth
let h = canvas.height = innerHeight
let mx = 0
let my = 0
let toggle = 0
let circlesCount = 4
let maxLength = 800

let circles = []

class Circle {
    constructor(x = Math.random() * w, y = Math.random() * h) {
        this.x = x
        this.y = y
    }

    draw(x, y) {
        this.x = x || this.x
        this.y = y || this.y

        ctx.lineWidth = 1.5
        ctx.fillStyle = 'white'
        ctx.strokeStyle = 'red'
        ctx.beginPath()
        ctx.arc(this.x, this.y, 6, 0, TWO_PI)
        ctx.closePath()
        ctx.fill()

        ctx.beginPath()
        ctx.arc(this.x, this.y, 32, 0, TWO_PI)
        ctx.closePath()
        ctx.stroke()
    }
}

const getDistance = (a, b) => {
    return ((a.x - b.x) ** 2 + (a.y - b.y) ** 2) ** .5
}

function createLightning () {
    for(let a = 0; a < circles.length; a++) {
        let {
            x: sx, y: sy
        } = circles[a]
        for(let b = a + 1; b < circles.length; b++ ) {
            let dist = getDistance(circles[a], circles[b])
            let chance = dist / maxLength

            if(chance > Math.random()) {
                continue
            }

            let otherColor = chance * 255
            let stepsCount = dist / stepLength
            
            ctx.lineWidth = 2.5
            ctx.strokeStyle = `rgb(${otherColor}, ${otherColor}, ${255})`

            ctx.beginPath()
            ctx.moveTo(sx, sy)
            for(let j = stepsCount; j > 1; j--) {
                const pathLength = getDistance(circles[a], {x: sx, y: sy})
                const offset = Math.sin(pathLength / dist * Math.PI) * maxOffset

                sx += (circles[b].x - sx) / j + Math.random() * offset * 2 - offset
                sy += (circles[b].y - sy) / j + Math.random() * offset * 2 - offset
                ctx.lineTo(sx, sy)
            }
            ctx.stroke()
            ctx.closePath()
        }        
    }
}

canvas.onmousemove = e => {
    mx = e.x
    my = e.y
}

window.onkeypress = e => {
    toggle == circles.length - 1 ? toggle = 0 : toggle++
}

window.onresize = e => {
    canvas.width = w = innerWidth
    canvas.height = h = innerHeight
}

const loop = () => {
    ctx.clearRect(0, 0, w, h)

    createLightning()
    circles.forEach(x => {
        x == circles[toggle] ? x.draw(mx, my) : x.draw()
    })

    requestAnimationFrame(loop)
}

const countInput = new Proxy(document.getElementById('count'), {
    set(target, prop, value) {
        if(prop === 'value') {
            if(+value < 2 || +value === circles.length) {
                return
            }
            if(+value < circles.length) {
                circles.length = +value
            }
            else {
                for(let i = circles.length; i < +value; i++) {
                    circles.push(new Circle)
                }
            }
        }
        target[prop] = value
    }
})

canvas.style.background = canvasColor
document.body.appendChild(canvas)
countInput.value = circlesCount
requestAnimationFrame(loop)

document.getElementById('count').addEventListener('input', function(e) {
    countInput.value = +e.target.value
})

document.getElementById('isClean').addEventListener('click', function(e) {
    ctx.clearRect = e.target.checked ? ctx.__proto__.clearRect : () => {}
})

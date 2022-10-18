
from pylab import *

nrows = 50
ncols = 50

grid=[]
hexsize = 1
for row in range(nrows):
    w = 0
    r=[]
    for col in range(ncols):
        w = 0 ** ((col+1) % 2)
        z = col*hexsize*1.5 + 1j*row*hexsize*sqrt(3) + 1j*hexsize*w*(sqrt(3)/2) 
        r.append(z)
    grid.append(r)

g = array(grid)






def getnext(x,r):
    newgrid = 0 * x
    R,C = x.shape
    n = linspace(0,5,6)
    for row in range(R):
        neighbors = zeros((6))
        for col in range(C):
            neighbors = [x[row,(col+1)%C], x[row,(col-1) % C], x[(row+1) % R,(col+1) % C],  x[(row+1) % R,(col+1) % C],  x[(row+1) % R,col],  x[(row-1) % R,col]]
            s = sum(2**n * neighbors)
            newgrid[row,col] = r[int(s)]
    return newgrid


valuegrid = randint(0,2,size=(nrows, ncols))
valuegrid *= 0
valuegrid[nrows//2,ncols//2] = 1


hex = hexsize * exp(2j*pi/6 * linspace(0,6,7))
colors=['black','white']     
i=0
v = valuegrid.flatten()
# for g in grid:
#     h = g + hex
#     plt.plot(h.real,h.imag,c='gray',linewidth=1)
#     if uniform(0,1) > 0.5:
#      plt.fill(h.real,h.imag,c=colors[v[i]],linewidth=0.1)
#     i += 1
    
plt.show()

q = valuegrid
h = 0*valuegrid
g2 = reshape(grid, (nrows, ncols))
rule = randint(0,2,64)
#rule=[0,0,1,0,1,0,1,0,0,0,1,1,1,1,0,0,0,0,0,1,0,0,1,1,1,0,1,1,1,1,0,0,1,1,0,1,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,1,0,0,1,1,1,1,0,0,0,1,1]
rule = [1,0,0,1,1,0,0,1,1,0,1,0,0,1,1,1,1,1,0,0,1,1,1,1,0,0,1,0,1,1,1,1,1,1,1,0,0,1,0,0,1,1,0,1,0,0,0,0,1,0,0,1,1,0,1,0,1,1,0,1,1,1,1,1]

s = '['
for r in rule:
    s += str(r) + ','
s = s[:-1]
s += ']'
print(s)
numiter = 3
try:
    for i in range(numiter):
        q = getnext(q,rule)
        for row in range(nrows):
            for col in range(ncols):
                h = g2[row,col] + hex
                plt.fill(h.real,h.imag,c=colors[q[row,col]])

        plt.show()

except KeyboardInterrupt:
    ...



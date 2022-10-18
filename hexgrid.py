'''
Make a grid of hexagons, try out CA stuff more easily
will it be tho? react project is close
64 possible states, make a scrollable list of picture diagrams, inputs are fixed, select outputs 
the 'name' of the rule is the 6 bit sequence of the output bits
the output bit is the central hexagon
also need boundary conditions
---

with cyclic boundary conditions, will it converge to something stable?

or make rules local, gliders that collide, make collision box around it and interactions on the box, type creation
'''


from pylab import *

nrows = 50
ncols = 50

grid=[]
hexsize = 1
for row in range(nrows):
    w = 0
    for col in range(ncols):
        w = 0 ** ((col+1) % 2)
        z = col*hexsize*1.5 + 1j*row*hexsize*sqrt(3) + 1j*hexsize*w*(sqrt(3)/2) 
        grid.append(z)

g = array(grid)
#plt.scatter(g.real,g.imag,s=1.0)
# plt.show()

# go through every point in the grid, draw a hexagon using 6 points on a circle
hex = hexsize * exp(2j*pi/6 * linspace(0,6,7))
colors=['green','purple']
i=0
# for g in grid:
#     h = g + hex
#     plt.plot(h.real,h.imag,c='gray',linewidth=1)
#     # if uniform(0,1) > 0.5:
#         # plt.fill(h.real,h.imag,c='black',linewidth=0.1)
#     i += 1
    
#plt.show()


# iteration time
valuegrid = randint(0,2,size=(nrows, ncols))

# but how to index / look at hex neighbors? don't use distance calculations, that's silly
# could look at rectangular neighbors, but that is not the goal
# need to find equivalent of hex neighbors when on a rectangular grid
# two versions, depends on orientation of hexagons
# up, down, up-left, up-right, down-left, down-right

'''
+1 col and -1 col in the same row (2) and the next row (4) and +1 row and -1 row in the same col

a : x[i,j+1]
b : x[i,j-1]
c : x[i+1,j+1]
d : x[i+1,j+1]
e : x[i+1,j]
f : x[i-1,j]

do it with a lookup table, calculate lookup index with binary encoded hexagons

'''


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



valuegrid *= 0
valuegrid[nrows//2,ncols//2] = 1


colors=['black','white']     
i=0
v = valuegrid.flatten()
for g in grid:
    h = g + hex
    plt.plot(h.real,h.imag,c='gray',linewidth=1)
    if uniform(0,1) > 0.5:
     plt.fill(h.real,h.imag,c=colors[v[i]],linewidth=0.1)
    i += 1
    
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
numiter = 30
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



'''
# simple horizontal oscillator
rule = [1 1 0 1 0 1 1 0 0 1 0 1 1 0 1 0 0 1 1 1 0 1 0 1 1 0 0 0 0 0 1 1 1 1 0 0 1
 0 0 1 1 1 1 1 1 1 0 1 0 0 1 1 0 1 0 0 1 0 0 0 0 0 0 1]

# triad moving up, a little off after the 3 iteration, how easy is it to fix it by looking at the rule? would be easier with a visual representation of the rule
[0 1 1 1 1 1 1 1 0 0 0 1 0 0 0 1 0 1 1 0 1 1 1 1 0 1 1 0 0 1 1 0 1 0 0 0 1
 1 0 1 0 1 0 0 0 1 1 0 1 0 1 1 0 1 0 0 0 1 0 0 1 1 0 0]


# downward right triangle thing
[0 0 1 0 1 1 0 0 0 1 1 1 0 0 0 0 1 1 1 1 1 1 1 0 0 0 1 0 1 0 1 1 0 1 0 0 0
 0 1 1 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 1 1 0 1 0 1 0 1]

# downward single 'row' - 2 hex
[1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,1,0,1,0,0,0,1,1,0,0,1,1,0,0,1,1,1,0,1,0,1,0,1,0,0,0]

# sierpinski?!
[0,0,1,0,1,0,1,0,0,0,1,1,1,1,0,0,0,0,0,1,0,0,1,1,1,0,1,1,1,1,0,0,1,1,0,1,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,1,0,0,1,1,1,1,0,0,0,1,1]


# almost a large a hexagon, middle is off but outline is there
[1,0,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,1,0,0,1,1,1,0,1,0,1,1,1,0,1,1,0,0,0,0,0,0,0,0,1,0,0,1,1,0,1,1,0,1,1,0,1,0,1,1,0,0,0,1,0,1,0,0]

# traveling down, oscillates between 3 and 5 hexagons but stable
rule = [1,0,0,1,1,0,0,1,1,0,1,0,0,1,1,1,1,1,0,0,1,1,1,1,0,0,1,0,1,1,1,1,1,1,1,0,0,1,0,0,1,1,0,1,0,0,0,0,1,0,0,1,1,0,1,0,1,1,0,1,1,1,1,1]

# almost like rule 30 but not quite
[0,1,0,1,1,0,1,0,1,0,1,0,0,1,1,0,1,1,1,0,0,0,0,1,0,1,1,1,0,1,1,1,1,1,0,0,0,0,1,1,0,1,1,0,1,0,1,0,1,0,0,0,1,0,1,1,1,1,1,0,1,1,0,0]


'''




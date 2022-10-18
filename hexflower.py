'''
making a hexagon pattern radially, not as a rectangular grid
for the future, how is a hexagonal grid formed so that it can form a sphere? it is a specific pattern when laid flat
'''

from pylab import *

def csplot(_z):
    plt.scatter(_z.real,_z.imag)

def cplot(w,c='blue'):
    plt.plot(w.real, w.imag,c=c)
    plt.plot([w[-1].real, w[0].real], [w[-1].imag, w[0].imag],c=c)


N = 1000
t = linspace(0,2*pi-1/N,N)
r = 6

# intial radius is 1, how does it grow?
hex0 = array([exp(2j*pi*q/6) for q in range(6)])
z = exp(2j*pi/r*t)
hex1 = array([sqrt(3)*exp(2j*pi*q/6)*exp(1j*pi/6) for q in range(6)])


for h in hex1:
    for h0 in hex0:
        ...#plt.scatter(h.real+h0.real,h.imag+h0.imag,c='k')
    
hex2 = [hex0 + x for x in hex1]
hex3a = [hex0 + x for x in array([2*sqrt(3)*exp(2j*pi*q/6)*exp(1j*pi/6) for q in range(6)]) ]
hex3b = [hex0 + x for x in array([sqrt(3)**2*exp(2j*pi*q/6) for q in range(6)]) ]
hex4a = [hex0 + x for x in array([3*sqrt(3)*exp(2j*pi*q/6)*exp(1j*pi/6) for q in range(6)]) ]

    
[cplot(hex2[i],'g') for i in range(6)]
cplot(hex0,'k')
[cplot(hex3a[i],'b') for i in range(6)]
[cplot(hex3b[i],'r') for i in range(6)]
[cplot(hex4a[i],'g') for i in range(6)]


show()


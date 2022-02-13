
export class Monitor {
    public static printInstances(): string {
        let response = ''
        Counter.objectsCount.forEach((val: number, key: string) => {
            response = response + `${key}: ${val} \n`
        })
        return response
    }


}

class Counter {

    static objectsCount: Map<string, number> = new Map()
    static increment(className: string) {
        if (!this.objectsCount.get(className)) { // if className does not exist on objectsCount Map
            this.objectsCount.set(className, 1)
        } else {
            const currentVal = this.objectsCount.get(className)
            this.objectsCount.set(className, currentVal! + 1)
        }
    }
}

// export function countInstances(constructor: Function) {
//     console.log('countInstances')
//     console.log(constructor)
//     Counter.increment(constructor.name)
// }

// Now countInstances will only when the class it is called on is declared
// The constructor below will be called eveytime the class is instantiated
export function countInstances<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        // we cant call Counter.increment(constructor.name) because this is not a run time enviornment
        // but by assigning it to a variable we are calling it
        abc = Counter.increment(constructor.name)
    };
}
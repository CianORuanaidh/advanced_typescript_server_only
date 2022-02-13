import { resolve } from "path/posix"

// method decorator tales in 3 parameters
export function logInvocation(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    const className = target.constructor.name

    let origininalMethod = descriptor.value
    descriptor.value = async function (...args: any[]) {
        console.log('\n\n\n')
        console.log('METHOD DECORATOR')
        console.log(`${className}#${propertyKey} called with ${JSON.stringify(args)}`)
        const result = await origininalMethod.apply(this, args)
        console.log(`${className}#${propertyKey} returned ${JSON.stringify(result)}`)
        console.log('\n\n\n')

        return result
    }

    return descriptor
}

export function delayResponse(delayMS: number) {
    return function(target: Object, propertyKey: string, descriptor: PropertyDescriptor){
        let origininalMethod = descriptor.value
        descriptor.value = async function (...args: any[]) {

            const result = await origininalMethod.apply(this, args)
            await delay(delayMS)

            return result
        }
    
        return descriptor        
    }
}

async function delay(timeout: number) {
    return new Promise<void>((resolve) => setTimeout(() => {
        resolve()
    }, timeout))
}
// declare module "myevent"{
// //extends NodeJS.EventEmitter
//     class EventEmitter {
//         run():()=>void;
//     }
//     import internal = require('events');
//     namespace EventEmitter {
//         export { internal as EventEmitter };
//     }
//     export = EventEmitter
// }

// class EventEmitter implements NodeJS.EventEmitter {
//     addListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
//         throw new Error("Method not implemented.");
//     }
//     on(eventName: string | symbol, listener: (...args: any[]) => void): this {
//         throw new Error("Method not implemented.");
//     }
//     once(eventName: string | symbol, listener: (...args: any[]) =>
//         //     class EventEmitter {
//         //         run():()=>void;
//         //     }
//         //     import internal = require('events');
//         //     namespace EventEmitter {
//         //         export { internal as EventEmitter };
//         //     }
//         //     export = EventEmitter
//         // }
//         void): this {
//         throw new Error("Method not implemented.");
//     }
//     removeListener(eventName: string | symbol, listener: (...args:
//         //     class EventEmitter {
//         //         run():()=>void;
//         //     }
//         //     import internal = require('events');
//         //     namespace EventEmitter {
//         //         export { internal as EventEmitter };
//         //     }
//         //     export = EventEmitter
//         // }
//         any[]) => void): this {
//         throw new Error("Method not implemented.");
//     }
//     off(eventName: string | symbol, listener: (...args: any[]) => void): this {
//         throw new Error("Method not implemented.");
//     }
//     removeAllListeners(event?: string | symbol | undefined): this {
//         throw new Error("Method not implemented.");
//     }
//     setMaxListeners(n: number): this {
//         throw new Error("Method not implemented.");
//     }
//     getMaxListeners(): number {
//         throw new Error("Method not implemented.");
//     }
//     listeners(eventName: string | symbol): Function[] {
//         throw new Error("Method not implemented.");
//     }
//     rawListeners(eventName: string | symbol): Function[] {
//         throw new Error("Method not implemented.");
//     }
//     emit(eventName: string | symbol, ...args: any[]): boolean {
//         throw new Error("Method not implemented.");
//     }
//     listenerCount(eventName: string | symbol): number {
//         throw new Error("Method not implemented.");
//     }
//     prependListener(eventName: string | symbol, listener: (...args:
//         //     class EventEmitter {
//         //         run():()=>void;
//         //     }
//         //     import internal = require('events');
//         //     namespace EventEmitter {
//         //         export { internal as EventEmitter };
//         //     }
//         //     export = EventEmitter
//         // }
//         any[]) => void): this {
//         throw new Error("Method not implemented.");
//     }
//     prependOnceListener(eventName: string | symbol, listener: (...
//         //     class EventEmitter {
//         //         run():()=>void;
//         //     }
//         //     import internal = require('events');
//         //     namespace EventEmitter {
//         //         export { internal as EventEmitter };
//         //     }
//         //     export = EventEmitter
//         // }
//         args: any[]) => void): this {
//         throw new Error("Method not implemented.");
//     }
//     eventNames(): (string | symbol)[] {
//         throw new Error("Method not implemented.");
//     }

// }

// const MyEventEmitter = new EventEmitter()


import { EventEmitter } from 'events';

const MyEventEmitter = new EventEmitter()

MyEventEmitter.setMaxListeners(10)

export default MyEventEmitter

export const TESTEVENT = "testevent"

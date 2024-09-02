// module contains a class RedisClient that defines
// a connection to redisClient and a set and get method
import { createClient } from 'redis';


class RedisClient {
	constructor() {
		this.client = createClient();
		this.client.on('error', (err) => {
			console.log(`Error connecting to redis client: ${err}`)
		});
	};

	async isAlive() {
		// returns true when the connection to Redis is a success otherwise, false
		try {
			await this.client.ping();
			return true;
		} catch (err) {
			return false;
		};
	};

	async get(key) {
		// takes a string key as argument and returns the Redis value stored for this key
		try {
			const value = await this.client.get(key);
			return value;
		} catch(err) {
			return null;
		};
	};
	
	async set(key, value, duration) {
		// takes a string key, a value and a duration in second as arguments
		// to store it in Redis (with an expiration set by the duration argument)
		try {
			await this.client.setex(key, duration, value);
		} catch(err) {
			console.log(`error setting ${key} : ${value}: ${err}`)
		}
	};
	
	async del(key) {
		// takes a string key as argument and remove the value in Redis for this key
		try {
			await this.client.del(key);
		} catch(err) {
			console.log(`error deleting key ${key}`);
		}
	};
}

const redisClient = new RedisClient();

export default redisClient;

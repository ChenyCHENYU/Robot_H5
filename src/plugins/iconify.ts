import { addCollection } from '@iconify/vue';
import collections from 'virtual:robot-icons';

export function setupIconify() {
    for (const collection of collections) addCollection(collection);
}

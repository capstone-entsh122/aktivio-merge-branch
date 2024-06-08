const firestore = require('../firebaseAdmin').firestore;
const index = require('../algoliaConfig');

async function indexCommunities() {
    const communitiesSnapshot = await firestore.collection('communities').get();
    const communities = communitiesSnapshot.docs.map(doc => {
        const community = doc.data();
        community.objectID = doc.id; // Algolia requires an objectID for each record
        return community;
    });

    try {
        const algoliaResponse = await index.saveObjects(communities);
        console.log('Communities indexed in Algolia:', algoliaResponse);
    } catch (error) {
        console.error('Error indexing communities in Algolia:', error);
    }
}

// indexCommunities();

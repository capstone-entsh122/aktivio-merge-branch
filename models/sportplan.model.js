const { firestore } = require('../config/firebaseAdmin');

class SportPlanModel {
  static async getSportPlanRecommendations(sport) {
    try {
      const sportPlansRef = firestore.collection('sportPlans').where('sportType', '==', sport);
      const snapshot = await sportPlansRef.get();
      
      if (snapshot.empty) {
        return [];
      }

      const sportPlans = [];
      snapshot.forEach(doc => {
        sportPlans.push({ id: doc.id, ...doc.data() });
      });

      return sportPlans;
    } catch (error) {
      throw new Error(`Error getting sport plan recommendations: ${error.message}`);
    }
  }

  static async setFinishedSportPlan(userId, planId, isCompleted) {
    try {
      const userRef = firestore.collection('users').doc(userId);
      const userDoc = await userRef.get();
      const plans = userDoc.get('sportPlan.plans');

      const updatedPlans = plans.map(plan => {
        if (plan.id === planId) {
          return { ...plan, isCompleted: isCompleted };
        }
        return plan;
      });

      await userRef.update({
        'sportPlan.plans': updatedPlans
      });

      return updatedPlans;
    } catch (error) {
      throw new Error(`Error setting sport plan completion status: ${error.message}`);
    }
  }

  static async updateElapsedTime(userId, planId, stepOrder, elapsedTime) {
    try {
      const userRef = firestore.collection('users').doc(userId);
      const userDoc = await userRef.get();
      const plans = userDoc.get('sportPlan.plans');
  
      let updatedPlan = null;
  
      const updatedPlans = plans.map(plan => {
        if (plan.id === planId) {
          // Update elapsed time for the specific step
          const updatedSteps = plan.steps.map(step => {
            if (step.order === stepOrder) {
              return { ...step, elapsedTime: elapsedTime };
            }
            return step;
          });
  
          // Calculate total elapsed time
          const totalElapsedTime = updatedSteps.reduce((sum, step) => sum + (step.elapsedTime || 0), 0);
  
          updatedPlan = { 
            ...plan, 
            steps: updatedSteps,
            totalElapsedTime: totalElapsedTime
          };
  
          return updatedPlan;
        }
        return plan;
      });
  
      await userRef.update({
        'sportPlan.plans': updatedPlans
      });
  
      return updatedPlan;
    } catch (error) {
      throw new Error(`Error updating elapsed time: ${error.message}`);
    }
  }
}

module.exports = SportPlanModel;

/* 
 * 
 * Brain Architect Common relationships
 * 
 * - defines common Brain Architect relationship. It consists of: 
 * 
 * 1. Aggregation
 * 2. Association
 * 3. Composition
 * 4. Dependency
 * 5. Generalization
 * 6. Realization
 * 
 * To create a new type of relationship you should use this template:
 * 
 * var <name>Relationship = {
 *  attrs:{                             
 *      attrs: {
 *          <raphael.js line settings>
 *      },
 *      endArrow:{
 *          type: <type of arrow>
 *          size: <number>
 *      },
 *      startArrow:{
 *          type: <type of arrow>
 *          size: <number>
 *      }
 *  },
 *  
 *  title: <string>
 *  type: <name|lowercase>
 *  onSet: <handleName>(reference)
 *  
 * };
 * 
 * Properties description:
 * -    attrs defines view settings of drawn elements: <attrs of line> | <endArrow settings> | <startArrow settings>
 * -    title is showm by Connection type selector (i.e. BAConnectionSelector)
 * -    onSet is a function called after created new relationship; reference 
 *      store created relationship; it's for example used to set name, stereotype
 *      or other relationship property
 */

/**
 * 1. Aggregation relationship
 */

var aggregationRelationship = {
    attrs: {                                    // parameters
        attrs:{
            'stroke-dasharray': ''
        },
        endArrow: {                                 // end arrow type
            type: "arrowblack", 
            size: 8 
        }
    },
    title: 'Aggregation',                       // title of connection
    type: 'aggregation',                         // set information about type connection
    onSet: function(reference){
        
    }
};
 
/**
 * 2. Association relationship
 */
   
var associationRelationship = {
    attrs: {
        attrs:{
            'stroke-dasharray': ''
        },
        endArrow: {                                 // end arrow type
            type: "none", 
            size: 8, 
            attrs: {
                fill: "white"
            }
        }
    },
    title: 'Association',
    type: 'association',
        
    onSet: function(reference){
    }
        
};
  
/**
 * 3. Composition relationship
 */
  
var compositionRelationship = {
    attrs: {
        attrs:{
            'stroke-dasharray': ''
        },
        endArrow: {                                 // end arrow type
            type: "arrowwhite", 
            size: 8, 
            attrs: {
                fill: "white"
            }
        }
    },
    title: 'Composition',
    type: 'composition'
};

/**
 * 4. Dependency relationship
 */
  
var dependencyRelationship = {
    attrs: {
        attrs:{
            'stroke-dasharray': '--'
        },
        endArrow: {                                 // end arrow type
            type: "simplearrow", 
            size: 4
        }
    },
    title: 'Dependency',
    type: 'generalization'
};
   
/**
 * 5. Generalization relationship
 */
 
var generalizationRelationship = {
    attrs: {
        attrs:{
            'stroke-dasharray': ''
        },
        endArrow: {                                 // end arrow type
            type: "basic", 
            size: 8, 
            attrs: {
                fill: "white"
            }
        }
    },
    title: 'Generalization',
    type: 'generalization'
};
  

 
/**
 * 6. Realization relationship
 */
   
var realizationRelationship = {
    attrs: {
        attrs:{
            'stroke-dasharray': '--'
        },
        endArrow: {                                 // end arrow type
            type: "basic", 
            size: 8, 
            attrs: {
                fill: "white"
            }
        }
    },
    title: 'Realization',
    type: 'realization'
};
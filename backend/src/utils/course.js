import { amber,redisClient } from "../db/index.js";
import {ApiError} from '../utils/ApiError.js'

class TempIdMapper {
    constructor() {
      this.mapping = new Map();
    }
  
    addMapping(tempId, realId) {
      this.mapping.set(tempId, realId);
    }
  
    getRealId(tempId) {
      return this.mapping.get(tempId) || null;
    }
  }

function isTempId(id) {
    return typeof id === 'string' && id.startsWith('temp_');
  }

async function processOperations(tx, type, courseId, operations){
    if (!type || !['prerequisites', 'learnings'].includes(type)) {
        throw new Error(`Invalid type: ${type}. Must be either 'prerequisites' or 'learnings'`);
    }
    if (!courseId || typeof courseId !== 'number') {
        throw new Error('Valid courseId is required');
    }
    if (!Array.isArray(operations)) {
        throw new Error('Operations must be an array');
    }

    let totalItems=0;
    try {
        totalItems = await tx[type].count({
            where: { courseId }
        });
    } catch (error) {
        throw new Error(`Failed to get count of ${type}: ${error.message}`);
    }

    const tempIdMapper = new TempIdMapper();
   
    console.log(totalItems)
    for (const op of operations) {
      try{
        switch (op.type) {
          case 'add':
            if (!op.description) {
                throw new Error('Description is required for add operation');
            }
            const newItem=await tx[type].create({
              data: {
                courseId,
                value: op.description,
                orderId: ++totalItems
              }
            });
            if (op.tempId) {
                tempIdMapper.addMapping(op.tempId, newItem.id);
              }

            console.log(totalItems)
            break;

          case 'update':
            if (!op.id && !op.tempId) {
                throw new Error('ID or tempId is required for update operation');
              }
    
              let realId = op.id;
              if (op.tempId) {
                realId = tempIdMapper.getRealId(op.tempId);
                if (!realId) {
                  throw new Error(`No matching item found for temp ID: ${op.tempId}`);
                }
              }
            const currentItem=await validateExists(tx, type,courseId, realId);
            // if (op.order) {
            //   await validateOrder(tx, type, courseId, op.order, op.id);
            // }
        
            if (!op.order && !op.description) {
                continue;
              }

            if (op.order) {
                validateOrderInput(op.order, totalItems);
                if(op.order!==currentItem.order) { 
                    await updateItemOrders(tx,type,courseId,currentItem.orderId,op.order)
                }
        
                // Validate the new order position
                // await validateOrder(tx, type, courseId, op.order, realId);
        }
            await tx[type].update({
                where: { id: realId },
                data: {
                    value: op.description || currentItem.value, // Update description if provided
                    orderId: op.order || currentItem.orderId, // Update order if provided
                },
            });
            break;

          case 'delete':
            if (!op.id && !op.tempId) {
                throw new Error('ID or tempId is required for delete operation');
              }
            let deleteId = op.id;
            if (op.tempId) {
            deleteId = tempIdMapper.getRealId(op.tempId);
            if (!deleteId) {
              throw new Error(`No matching item found for temp ID: ${op.tempId}`);
            }
             }
            const item =await validateExists(tx, type,courseId, deleteId);
            await tx[type].delete({
              where: { 
                id: deleteId ,
                courseId
            }
            });
            // Reorder remaining items
            if (op.tempId) {
                tempIdMapper.mapping.delete(op.tempId);
              }
            await reorderAfterDelete(tx, type, courseId, item.orderId);
            totalItems--;
            break;

          default:
            throw new Error(`Invalid operation type: ${op.type}`);
        }}catch (error) {
            throw new Error(`Error processing ${op.type} operation: ${error.message}`);
        }
      }
      return tempIdMapper
}

function validateOrderInput(orderId, totalItems) {
    if (typeof orderId !== 'number') {
        throw new Error('Order must be a number');
    }
    if (orderId < 1) {
        throw new Error('Order cannot be less than 1');
    }
    if (orderId > totalItems) {
        throw new Error(`Order cannot exceed total items (${totalItems})`);
    }
}

async function updateItemOrders(tx, type, courseId, currentOrder, newOrder) {
    const updateQuery = {
        where: {
            courseId,
            orderId: newOrder > currentOrder
                ? { gt: currentOrder, lte: newOrder }
                : { gte: newOrder, lt: currentOrder }
        },
        data: {
            orderId: {
                [newOrder > currentOrder ? 'decrement' : 'increment']: 1
            }
        }
    };
    
    try {
        await tx[type].updateMany(updateQuery);
    } catch (error) {
        throw new Error(`Failed to update order: ${error.message}`);
    }
}

async function validateOrder(tx, type, courseId, orderId, excludeId = null) {
    try {
        const existing = await tx[type].findFirst({
            where: {
                courseId,
                orderId,
                NOT: excludeId ? { id: excludeId } : undefined
            }
        });
        if (existing) {
            throw new Error(`Item with order ${orderId} already exists`);
        }
    } catch (error) {
        throw new Error(`Order validation failed: ${error.message}`);
    }
  }
  
async function validateExists(tx, type,courseId, idOrTempId) {
    if (isTempId(idOrTempId)) {
        return null; // Skip validation for temp IDs
      }
    
    try {
        const item = await tx[type].findFirst({
            where: { 
                id:idOrTempId,
                courseId
            },
            select:{
                id:true,
                orderId:true,
                value:true
            }
        });
        if (!item) {
            throw new Error(`${type} item with id ${idOrTempId} not found`);
        }
        return item;
    } catch (error) {
        throw new Error(`Existence validation failed: ${error.message}`);
    }
  }
  
async function reorderAfterDelete(tx, type, courseId, deletedOrder) {
    try {
        await tx[type].updateMany({
            where: {
                courseId,
                orderId: { gt: deletedOrder }
            },
            data: {
                orderId: { decrement: 1 }
            }
        });
    } catch (error) {
        throw new Error(`Reordering after delete failed: ${error.message}`);
    }
  }


  async function handleRedisOperations(courseId, updatedCurrentState, jobId) {
    try {
      console.log(updatedCurrentState)
      const redisKey = `courses:${courseId}:goals`;
      await redisClient.multi()
        .hSet(redisKey, 'updatedCurrentState',JSON.stringify(updatedCurrentState))
        .hSet(redisKey, 'jobid', jobId)
        .exec();
    } catch (error) {
      console.error('Redis operation failed:', error);
      throw new ApiError(500, "Failed to update cache");
    }
  }
  
  function validateDeletions(deletions, existingIds, currentStateIds) {
    if (!Array.isArray(deletions)) {
      throw new ApiError(400, "Deletions must be an array");
    }
  
    if (!deletions.every(id => typeof id === 'number')) {
      throw new ApiError(400, "All deletion IDs must be numbers");
    }
  
    if (!deletions.every(id => existingIds.has(id))) {
      const invalidIds = deletions.filter(id => !existingIds.has(id));
      throw new ApiError(400, `Some deletion IDs don't exist in the database: ${invalidIds.join(', ')}`);
    }
  
    if (deletions.some(id => currentStateIds.has(id))) {
      throw new ApiError(400, "Cannot delete IDs that are still in currentState");
    }
  }
  
  function validateUpdates(updates, existingIds, currentStateIds) {
    if (!Array.isArray(updates)) {
      throw new ApiError(400, "Updates must be an array");
    }
  
    if (!updates.every(update => typeof update.id === 'number')) {
      throw new ApiError(400, "All update IDs must be numbers");
    }
  
    if (!updates.every(update => existingIds.has(update.id))) {
      const invalidIds = updates
        .filter(update => !existingIds.has(update.id))
        .map(update => update.id);
      throw new ApiError(400, `Some update IDs don't exist in the database: ${invalidIds.join(', ')}`);
    }
  
    if (!updates.every(update => currentStateIds.has(update.id))) {
      throw new ApiError(400, "Cannot update IDs that are not in currentState");
    }
  }  

export{
    processOperations,
    handleRedisOperations,
    validateDeletions,
    validateUpdates
}  
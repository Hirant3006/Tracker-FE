import {reduce} from 'lodash';

export default function prefixNamespace(namespace, types){
    return reduce(types, (typeObj, typeValue, typeName) => {
      	typeObj[typeName] = reduce(typeValue, (obj, v, k)=>{
			obj[k] = namespace + v
			return obj
      	}, {})
      	return typeObj
    }, {})
}
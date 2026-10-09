# API Integration for GoodFood
Basic description for the API Integration in GoodFood

## Implementation guide

In your component file, include the ApiService file and the API you would like to include.

```ts
import { Popular } from "../../api/dietly";

```

Then within the component definition, add the function as a prop

```ts
const { foods } = Popular();
```

Finally within the return, add the prop **using a conditional statement** ``(prop ? (ifTrue) : (ifFalse))``

```ts
return (
		<View>
			<Text>
				{foods ? (foods[0].name) : ("Something went wrong.")}
			</Text>
		</View>
	);
```

And then you have implemented an API!!

## Layers
API Integration is done in 3 layers.
### 1. Client Layer

This is the file `apiClient.ts`, you create a template for the basic HTTPS request to the API. 

### 2. Functional Layer

This is the file named after the API, for example `edamam.ts`. This contains all the functions which are needed to use the API. The main functionality is here.

### 3. Service Layer

This is the file ``apiService.ts``. Prepare the hooks for the react implementation of the API. This is what links the APIs to React and allows usage by components.


## Types
All response types for the Api's is laid out in ``types.ts`` so that we only receive the values we'd like. How these are made depends on the API.

## Secret

A file called `secrets.ts` containing API keys which **should never be tracked by git!!** If you need one ask Leo.

## Why is it like this?
This is to make it as easy as possible for the developers making other components, as well as making future API integrations easier and more centralized.

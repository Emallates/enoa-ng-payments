import { addCard } from "./directives";

export default angular.module('stripe.directives', [])
  .directive('createSourceToStripe', addCard.Factory)
  ;
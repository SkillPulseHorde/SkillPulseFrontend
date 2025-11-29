import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function criteriaCommentRequiredValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const rating = formGroup.get('rating')?.value;
    const comment = formGroup.get('comment')?.value;

    const isCommentRequired =
      rating === 1 ||
      rating === 2 ||
      rating === 9 ||
      rating === 10;

    if (isCommentRequired && (!comment || comment.trim() === '')) {
      formGroup.get('comment')?.setErrors({...formGroup.get('comment')?.errors, commentRequired: true});

      return {commentRequired: true};
    }

    if (formGroup.get('comment')?.errors?.['commentRequired']) {
      const { commentRequired, ...otherErrors } = formGroup.get('comment')!.errors!;

      formGroup.get('comment')?.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
    }

    return null;
  };
}

export function criteriaRatingOrCannotEvaluateValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {

    const cannotEvaluate = formGroup.get('cannotEvaluate')?.value;
    const rating = formGroup.get('rating')?.value;

    const isValid = cannotEvaluate || (rating !== null && rating >= 1 && rating <= 10);

    if (!isValid) {
      return {ratingOrCannotEvaluateRequired: true};
    }

    return null;
  };
}

export function mandatoryCriteriaValidator(isMandatory: boolean): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const rating = formGroup.get('rating')?.value;

    if (!isMandatory) {
      return null;
    }

    const isValid = rating !== null && rating >= 1 && rating <= 10;

    if (!isValid) {
      return {mandatoryCriteria: true};
    }

    return null;
  }
}

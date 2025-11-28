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
      delete formGroup.get('comment')?.errors?.['commentRequired'];
      formGroup.get('comment')?.setErrors(Object.keys(formGroup.get('comment')!.errors!).length ? formGroup.get('comment')!.errors : null);
    }

    return null;
  };
}

export function criteriaRatingOrCannotEvaluateValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {

    const cannotEvaluate = formGroup.get('cannotEvaluate')?.value;
    const rating = formGroup.get('rating')?.value;

    const isValid = cannotEvaluate || (rating >= 1 && rating <= 10);

    if (!isValid) {
      return {ratingOrCannotEvaluateRequired: true};
    }

    return null;
  };
}

export function mandatoryCriteria(isMandatory: boolean): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const rating = formGroup.get('rating')?.value;

    if (!isMandatory) {
      return null;
    }

    const isValid = rating >= 1 && rating <= 10

    if (!isValid) {
      return {mandatoryCriteria: true};
    }

    return null;
  }
}

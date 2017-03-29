'use strict';

angular.module('FileReadDirective', [])

    .directive("fileread", [function () {
        return {
            scope: {
                fileread: "=",
                format: "="
            },
            link: function (scope, element) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();

                    reader.onloadend = function() {
                        //First, check that the format is pdf, docx, or doc
                        var filename = element[0].value.replace(/.*[\/\\]/, '');
                        filename = filename.split('.');
                        var format = filename[filename.length-1];
                        if(format !== 'jpg' && //TODO consider refactorign so this is reusable
                            format !== 'gif' &&
                            format !== 'jpeg'){
                            scope.$apply(function() {
                                scope.format = false;
                            });
                            console.log('Invalid Format');
                            return;
                        }


                        var dataUrl = reader.result;
                        var base64 = dataUrl.split(',')[1];
                        scope.$apply(function() {
                            scope.fileread = base64;
                            scope.format = format;
                        });
                    };
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        };
    }]);

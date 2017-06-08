(function() {
    'use strict';
    angular
        .module('app.tribe')
        .controller('TribeWifiPageController', TribeWifiPageController);

    function TribeWifiPageController($scope, _, $rootScope, $mdDialog, $document, $window, $http, $log, $state, $timeout,$stateParams) {
        var vm = this;

        var columnDefs = [{
            headerName: "Name",
            field: "name",
            cellRenderer: function(params) {
                if (params.data.flagcheck == false) {
                    return '<div class="values color-87">' + params.data.name + '</div>';
                } else {
                    return '<div class="values color-87">' + params.data.name + '<md-icon md-font-icon="zmdi zmdi-lock" class="padding-left-10"></md-icon></div>';
                }
            },
            width: 120
        }, {
            headerName: "No. of Page",
            field: "noofpage",
            width: 110
        }, {
            headerName: "Created By",
            field: "createdby",
            width: 110
        }, {
            headerName: "Modified By",
            field: "modifiedby",
            width: 110
        }, {
            headerName: "Created Date",
            field: "createddate",
            width: 120
        }, {
            headerName: "Last Modified",
            field: "lastmodifieddate",
            width: 120
        }, {
            headerName: "Watch",
            field: "watch",
            template: '<md-icon md-font-icon="fa fa-eye" aria-hidden="true"></md-icon>',
            width: 90
        }, {
            headerName: "",
            field: "cretemap",
            suppressSorting: true,
            suppressMenu: true,
            cellRenderer: createMenuTemp,
            width: 80
        }];

        vm.gridOptions = {
            columnDefs: columnDefs,
            rowData: null,
            enableSorting: true,
            rowSelection: 'single',
            rowDeselection: true,
            suppressCellSelection: true,
            angularCompileRows: true,
            paginationPageSize: 10,
            onRowClicked: onRowClicked,
            rowModelType: 'pagination',
            headerHeight: 48,
            rowHeight: 56,
            icons: {
                sortAscending: '<i class="zmdi zmdi-long-arrow-down"></i>',
                sortDescending: '<i class="zmdi zmdi-long-arrow-up"></i>',
                columnMovePin: '<i class="fa fa-hand-grab-o"/>',
                columnMoveAdd: '<i class="fa fa-plus-square-o"/>',
                columnMoveHide: '<i class="fa fa-remove"/>',
                columnMoveMove: '<i class="fa fa-chain"/>',
                columnMoveLeft: '<i class="fa fa-arrow-left"/>',
                columnMoveRight: '<i class="fa fa-arrow-right"/>',
                columnMoveGroup: '<i class="fa fa-group"/>',
                groupExpanded: '<i class="fa fa-minus-square-o"/>',
                groupContracted: '<i class="fa fa-plus-square-o"/>',
                columnGroupOpened: '<i class="fa fa-minus-square-o"/>',
                columnGroupClosed: '<i class="fa fa-plus-square-o"/>',
                menu: '<i class="zmdi zmdi-menu"></i>',
                filter: '<i class="zmdi zmdi-filter-list"></i>',
                checkboxChecked: '<img src="assets/images/checkmaterial/checked.png"/>',
                checkboxUnchecked: '<img src="assets/images/checkmaterial/unchecked.png"/>'
            }
        };

        vm.rowData = [];
        var dataSource, allOfTheData, rowsThisPage;
        var url = 'assets/data/tribe/wifi/tribe-wiki-mainpage.json';

        $http.get(url)
            .success(function(data) {
                vm.rowData = data;
                allOfTheData = data;
                $timeout(function() {
                    dataSource = {
                        rowCount: allOfTheData.length,
                        getRows: function(params) {
                            setTimeout(function() {
                                rowsThisPage = allOfTheData.slice(params.startRow, params.endRow);
                                var lastRow = -1;
                                if (allOfTheData.length <= params.endRow) {
                                    lastRow = allOfTheData.length;
                                }
                                params.successCallback(rowsThisPage, lastRow);
                            }, 200);
                        }
                    };
                    vm.gridOptions.api.setDatasource(dataSource);
                    var width = vm.gridOptions.api.gridCore.eGridDiv.clientWidth;
                    var columnWidth = 0;
                    _.each(columnDefs, function(col) {
                        columnWidth += col.width;
                    });
                    if (width > columnWidth) vm.gridOptions.api.sizeColumnsToFit();
                }, 500);
            });

        function createMenuTemp(params, $index) {
            if (!params.data) return '';
            var template = '<md-menu md-position-mode="target-right target">' +
                '<md-button class="md-icon-button" aria-label="Actions">' +
                '<md-icon aria-label="Actions" class="zmdi zmdi-more-vert zmdi-hc-lg" ng-click="vm.openTableMenu($mdOpenMenu, $event)"></md-icon>' +
                '</md-button>' +
                '<md-menu-content>' +
                '<md-menu-item ng-click="vm.makeprivate($event, data, rowNode)">' +
                '<md-button><md-icon md-font-icon="zmdi zmdi-lock"></md-icon>Make Private</md-button>' +
                '</md-menu-item>' +
                '<md-menu-item>' +
                '<md-button><md-icon md-font-icon="zmdi zmdi-delete"></md-icon>Delete</md-button>' +
                '</md-menu-item>' +
                '</md-menu-content>' +
                '</md-menu>';
            return template;
        }

        vm.createNewRowData = createNewRowData;
        // $rootScope.valueforwiki = $scope.createnewwiki;
        function createNewRowData(make) {
            var newData = {
                name: $rootScope.valueforwiki,
                noofpage: $rootScope.poonam,
                createdby: "Wasim Shaikh",
                modifiedby: "-",
                createddate: "2 May 2017",
                lastmodifieddate: "2 May 2017",
                // watch: '<md-icon md-font-icon="fa fa-eye"></md-icon>'
                // cretemap: '<md-menu md-position-mode="target-right target">' +
                //     '<md-button class="md-icon-button" aria-label="Actions">' +
                //     '<md-icon aria-label="Actions" class="zmdi zmdi-more-vert zmdi-hc-lg" ng-click="vm.openTableMenu($mdOpenMenu, $event)"></md-icon>' +
                //     '</md-button>' +
                //     '<md-menu-content>' +
                //     '<md-menu-item>' +
                //     '<md-button><md-icon md-font-icon="fa fa-lock"></md-icon>Make Private</md-button>' +
                //     '</md-menu-item>' +
                //     '<md-menu-item>' +
                //     '<md-button><md-icon md-font-icon="fa fa-trash"></md-icon>Delete</md-button>' +
                //     '</md-menu-item>' +
                //     '</md-menu-content>' +
                //     '</md-menu>'
            };
            return newData;
        }

        vm.makeprivate = function($event, data, rowNode) {
            var addsecurity = [];
            vm.gridOptions.api.forEachNode(function(node) {
                var newdatas = node.data;
                if (node.childIndex == rowNode.childIndex) {
                    if (newdatas.flagcheck == false) {
                        node.data.flagcheck = true;
                    }
                }
                addsecurity.push(node)
            });
            vm.gridOptions.api.refreshRows(addsecurity);
        };

        vm.addItem = addItem;

        function addItem(ev, data, rowNode) {
            $mdDialog.show({
                parent: angular.element($document[0].body),
                targetEvent: ev,
                hasBackdrop: false,
                clickOutsideToClose: false,
                locals: {
                    rowgrids: vm.gridOptions,
                    currrownode: rowNode
                },
                templateUrl: 'app/modules/tribe/wifi/create-new-wiki/create-new-wiki-page.html',
                controller: function addwikiController($scope, $mdDialog, $interval, $mdMedia, rowgrids, currrownode) {

                    var vm = this;
                    vm.cancel = cancel;

                    vm.submitwiki = submitwiki;

                    function submitwiki(ev) {
                      $rootScope.valueforwiki = $scope.createnewwiki;
                      $rootScope.poonam = "Poonam";
                      console.log("$scope.createnewwiki",$scope.createnewwiki);
                        var newItem = createNewRowData();
                        rowgrids.api.addItems([newItem]);
                    }

                    function cancel() {
                        $mdDialog.cancel();
                    }
                },
                controllerAs: 'vm'
            });
        }

        function onRowClicked(row) {
          var data = row.data;
          var wifiparams = data.name;
          console.log("wifiparams",wifiparams);
            $state.go('triangular.tribe.wikihomepage', {
              samsungstatus: wifiparams
            });
        };

        var originatorEv;
        vm.openTableListMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(originatorEv);
        };

        vm.openTableMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(originatorEv);
        };


    }

})();

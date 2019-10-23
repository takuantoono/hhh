(function() {

Game_Actor.prototype.paramPlus = function(paramId) {
    //var value = Game_Battler.prototype.paramPlus.call(this, paramId);
    value = 0;
    var equips = this.equips();
    for (var i = 0; i < equips.length; i++) {
        var item = equips[i];
        if (item) {
        	if(item.params[paramId]>0){
            	value += item.params[paramId];
            }
        }
    }
    return value;
};

Game_Actor.prototype.paramPlus3 = function(paramId) {
    //var value = Game_Battler.prototype.paramPlus.call(this, paramId);
    value = 0;
    var equips = this.equips();
    for (var i = 0; i < equips.length; i++) {
        var item = equips[i];
        if (item) {
        	if(item.params[paramId]<=0){
            	value += item.params[paramId];
            }
        }
    }
    return value;
};

Game_Actor.prototype.paramPlus2 = function(paramId) {
    var value = Game_Battler.prototype.paramPlus.call(this, paramId);
    return value;
};

Game_BattlerBase.prototype.allTraits3 = function() {
    return this.traitObjects().reduce(function(r, obj) {
        if(obj.meta.objectState){
        return r;
        }else{
        return r.concat(obj.traits);
        }
    }, []);
};

Game_BattlerBase.prototype.traitsWithId3 = function(code, id) {
    return this.allTraits3().filter(function(trait) {
        return trait.code === code && trait.dataId === id;
    });
};

Game_BattlerBase.prototype.traitsPi3 = function(code, id) {
    return this.traitsWithId3(code, id).reduce(function(r, trait) {
        return r * trait.value;
    }, 1);
};

Game_BattlerBase.prototype.paramRate3 = function(paramId) {
    return this.traitsPi3(Game_BattlerBase.TRAIT_PARAM, paramId);
};

Game_BattlerBase.prototype.allTraits2 = function() {
    return this.traitObjects().reduce(function(r, obj) {
        if(!obj.meta.objectState){
        return r;
        }else{
        return r.concat(obj.traits);
        }
    }, []);
};

Game_BattlerBase.prototype.traitsWithId2 = function(code, id) {
    return this.allTraits2().filter(function(trait) {
        return trait.code === code && trait.dataId === id;
    });
};

Game_BattlerBase.prototype.traitsPi2 = function(code, id) {
    return this.traitsWithId2(code, id).reduce(function(r, trait) {
        return r * trait.value;
    }, 1);
};

Game_BattlerBase.prototype.paramRate2 = function(paramId) {
    return this.traitsPi2(Game_BattlerBase.TRAIT_PARAM, paramId);
};


	var getMetaValues2 = function(object, name) {
        var metaTagName = (name ? name : '');
        if(!object.meta)return;
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

	var _Game_Unit_aliveMembers      = Game_Unit.prototype.aliveMembers;
    Game_Unit.prototype.aliveMembers = function() {
        var members = _Game_Unit_aliveMembers.apply(this, arguments);
        return members.filter(function(member) {
            return !member.isBetrayer();
        });
    };
    
    Game_BattlerBase.prototype.isBetrayer = function() {
        return this.traitObjects().some(function(traitObject) {
            return getMetaValues2(traitObject, ['mikata']);
        });
    };


BattleManager.processTurn = function() {
    var subject = this._subject;
    var action = subject.currentAction();
    if (action) {
        action.prepare();
        if (action.isValid()) {
            this.startAction();
        }
        subject.removeCurrentAction();
    } else {
        subject.onAllActionsEnd();
        this.refreshStatus();
        this._logWindow.displayAutoAffectedStatus(subject);
        this._logWindow.displayCurrentState(subject);
        this._logWindow.displayRegeneration(subject);
        this._subject = this.getNextSubject();
    }
};

Window_BattleLog.prototype.displayAction = function(subject, item) {
    var numMethods = this._methods.length;
    if (DataManager.isSkill(item)) {
        if (item.message1) {
        var equips = subject.equips();
        if(item.meta.normalat && subject.isActor()){
        if((subject._dualWieldSpriteIndex-1)>0){
        var wepid = subject._dualWieldSpriteIndex - 1;
        }else{
        var wepid = 0;
        }
        if(equips[wepid]){
         this.push('addText', subject.name() + ' : ' + $dataWeapons[equips[wepid].id].name);
         }else{
         this.push('addText', subject.name() + item.message1.format(item.name));
         };
        }else{
            this.push('addText', subject.name() + item.message1.format(item.name));
        }
        }
        if (item.message2) {
            this.push('addText', item.message2.format(item.name));
        }
    } else {
        this.push('addText', TextManager.useItem.format(subject.name(), item.name));
    }
    if (this._methods.length === numMethods) {
        this.push('wait');
    }
    $gameSwitches.setValue(892, false);
};



Scene_Item.prototype.create = function() {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createCategoryWindow();
    this.createItemWindow();
    this.createActorWindow();
    $gameVariables.setValue(511, " ");
    $gameVariables.setValue(509, " ");
    $gameVariables.setValue(173, 0);
    this._helpWindow.refresh();
};





Window_Selectable.prototype.callUpdateHelp = function() {
    if (this.active && this._helpWindow) {
    
    if($gameVariables.value(173)!=0){
    
    actor = $gameVariables.value(173);
    if(actor.isStateAffected(11)){
      $gameVariables.setValue(511, $dataItems[15].name);
      $gameVariables.setValue(509, $gameParty.numItems($dataItems[15]));
    }
    if(actor.isStateAffected(12)){
    	$gameVariables.setValue(511, $dataItems[19].name);
    	$gameVariables.setValue(509, $gameParty.numItems($dataItems[19]));
    }
    }
        this.updateHelp();
    }
};

Scene_Map.prototype.updateMainMultiply = function() {
    this.updateMain();
    if (this.isFastForward()) {
        this.updateMain();
    }
};

Scene_Map.prototype.updateMain = function() {
    var active = this.isActive();
    $gameMap.update(active);
    $gamePlayer.update(active);
    if($gameSwitches.value(634)) $gameTimer.update(active);
    $gameScreen.update();
};


Game_Map.prototype.update = function(sceneActive) {
    this.refreshIfNeeded();
    if (sceneActive) {
        this.updateInterpreter();
    }
    //this.updateScroll();
    this.updateEvents();
    //this.updateVehicles();
    //this.updateParallax();
};

Game_CharacterBase.prototype.update = function() {
    if (this.isStopping()) {
        this.updateStop();
    }
    if (this.isJumping()) {
       // this.updateJump();
    } else if (this.isMoving()) {
        this.updateMove();
    }
    this.updateAnimation();
};

Game_Player.prototype.update = function(sceneActive) {
    var lastScrolledX = this.scrolledX();
    var lastScrolledY = this.scrolledY();
    var wasMoving = this.isMoving();
    //this.updateDashing();
    if (sceneActive) {
        this.moveByInput();
    }
    Game_Character.prototype.update.call(this);
    //this.updateScroll(lastScrolledX, lastScrolledY);
    //this.updateVehicle();
    if (!this.isMoving()) {
        this.updateNonmoving(wasMoving);
    }
    //this._followers.update();
};


})();

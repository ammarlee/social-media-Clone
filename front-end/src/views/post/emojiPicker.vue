<template>
  <div class="textarea-emoji-picker">
    <div class="contnent">
      <v-menu  bottom min-width="200px" :close-on-content-click="false" rounded offset-y>
        <template v-slot:activator="{ on }">
            <span
               v-on="on"
              class="emoji-trigger"
              :class="{ 'triggered': showEmojiPicker }"
              @mousedown.prevent="toggleEmojiPicker"
            >
              <v-icon>mdi-emoticon-neutral-outline</v-icon>
            </span>
        </template>
        <v-card>
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <picker id="thePicker"  @select="addEmoji" />
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>

      <textarea
        type="text"
        ref="textarea"
        class="textarea"
        :value="value"
        @input="$emit('input', $event.target.value)"
        @keyup.enter.exact="onEnterKey()"
      >
       

    >
    </textarea>
    </div>
  </div>
</template>
<script>
import { Picker } from "emoji-mart-vue";
export default {
  components: { Picker },
  data() {
    return {
      showEmojiPicker: false,
    };
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    sendMessage: { type: Function },
  },
  methods: {
    toggleEmojiPicker() {
      this.showEmojiPicker = !this.showEmojiPicker;
    },
    onEnterKey() {
      this.sendMessage();
    },
    addEmoji(emoji) {
      const textarea = this.$refs.textarea;
      const cursorPosition = textarea.selectionEnd;
      const start = this.value.substring(0, textarea.selectionStart);
      const end = this.value.substring(textarea.selectionStart);
      const text = start + emoji.native + end;
      this.$emit("input", text);
      textarea.focus();
      this.$nextTick(() => {
        textarea.selectionEnd = cursorPosition + emoji.native.length;
      });
    },
  },
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}
.textarea-emoji-picker {
  position: relative;
  width: 100%;
  margin: 0 auto;
}
.textarea {
  width: 100%;
  max-height: 300px;
  max-height: 120px;
  outline: none;
  box-shadow: none;
  padding: 10px 28px 10px 10px;
  font-size: 15px;
  border: 1px solid #bababa;
  color: #333;
  border-radius: 2px;
  box-shadow: 0px 2px 4px 0 rgba(0, 0, 0, 0.1) inset;
  resize: vertical;
}
.emoji-mart {
  /* position: absolute;
  z-index: 222222;
  bottom: 8px;
  right: 36px;
  width:300px */
}
.emoji-trigger {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  height: 20px;
}
.emoji-trigger path {
  transition: 0.1s all;
}
.emoji-trigger:hover path {
  fill: #000000;
}
.emoji-trigger.triggered path {
  fill: darken(#fec84a, 15%);
}
</style>
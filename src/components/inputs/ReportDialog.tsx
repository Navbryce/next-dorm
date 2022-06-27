import { FunctionalComponent } from "preact";
import StdLayout, {
  MainContent,
  Title,
  Toolbar,
} from "src/components/StdLayout";
import { z } from "zod";
import { Label } from "src/components/inputs/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod";
import { useCallback } from "preact/compat";

const ReportSchema = z.object({
  reason: z.string().nonempty("Enter a reason").email(),
});

export type ReportForm = z.infer<typeof ReportSchema>;

export type Props = {
  onSubmit: (form: ReportForm) => void;
};

const ReportDialog: FunctionalComponent<Props> = ({ onSubmit, children }) => {
  const { register, handleSubmit } = useForm<ReportForm>({
    resolver: zodResolver(ReportSchema),
    reValidateMode: "onSubmit",
  });
  const onReportCb = useCallback(
    (form: ReportForm) => {
      onSubmit(form);
    },
    [onSubmit]
  );
  return (
    <div>
      <div>{children}</div>
      <form className="form-layout" onSubmit={handleSubmit(onReportCb) as any}>
        <Label>Reason</Label>
        <input {...register("reason")} />
        <button className="btn">Submit report</button>
      </form>
    </div>
  );
};

export default ReportDialog;
